import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Box, Text } from 'ink';
import { ProgressBar } from '@inkjs/ui';
import Spinner from 'ink-spinner';
import pLimit from 'p-limit';

type TaskStatus = 'idle' | 'running' | 'success' | 'error';

interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  progress: number;
  payload: any;
  error?: Error;
  result?: any;
}

export function useTaskQueue(concurrencyLimit = 3) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const runningTasks = useMemo(() => 
    tasks.filter((t: Task) => t.status === 'running'), [tasks]);
  
  const queuedTasks = useMemo(() => 
    tasks.filter((t: Task) => t.status === 'idle'), [tasks]);
  
  const completedTasks = useMemo(() => 
    tasks.filter((t: Task) => ['success', 'error'].includes(t.status)), [tasks]);
  
  const totalProgress = useMemo(() => {
    if (tasks.length === 0) return 0;
    const total = tasks.reduce((sum: number, task: Task) => sum + task.progress, 0);
    return Math.floor(total / tasks.length);
  }, [tasks]);
  
  const addTask = useCallback((name: string, payload: any) => {
    const id = Math.random().toString(36).substring(2, 9);
    setTasks((prev: Task[]) => [...prev, {
      id,
      name,
      status: 'idle',
      progress: 0,
      payload
    }]);
    return id;
  }, []);
  
  const updateProgress = useCallback((id: string, progress: number) => {
    setTasks((prev: Task[]) => prev.map((task: Task) => 
      task.id === id ? { ...task, progress } : task
    ));
  }, []);
  
  const processQueue = useCallback(async (
    processFn: (payload: any, onProgress: (progress: number) => void) => Promise<any>
  ) => {
    if (isProcessing || queuedTasks.length === 0) return;
    
    setIsProcessing(true);
    const limit = pLimit(concurrencyLimit);
    
    try {
      await Promise.all(queuedTasks.map((task: Task) => limit(async () => {
        setTasks((prev: Task[]) => prev.map((t: Task) => 
          t.id === task.id ? { ...t, status: 'running' } : t
        ));
        
        try {
          const result = await processFn(
            task.payload, 
            (progress: number) => updateProgress(task.id, progress)
          );
          
          setTasks((prev: Task[]) => prev.map((t: Task) => 
            t.id === task.id ? { ...t, result, status: 'success' } : t
          ));
          
          return result;
        } catch (error) {
          setTasks((prev: Task[]) => prev.map((t: Task) => 
            t.id === task.id ? { ...t, error: error as Error, status: 'error' } : t
          ));
          
          throw error;
        }
      })));
    } finally {
      setIsProcessing(false);
    }
  }, [queuedTasks, isProcessing, concurrencyLimit, updateProgress]);
  
  return {
    tasks,
    runningTasks,
    queuedTasks,
    completedTasks,
    totalProgress,
    isProcessing,
    
    addTask,
    processQueue,
    
    updateProgress
  };
}

export const TaskProgress: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Box width={20}>
          <Text>{task.name}</Text>
        </Box>
        <Box marginLeft={1}>
          {task.status === 'running' && (
            <Text color="yellow">
              <Spinner /> Processing...
            </Text>
          )}
          {task.status === 'success' && <Text color="green">✓ Completed</Text>}
          {task.status === 'error' && <Text color="red">✗ Failed</Text>}
        </Box>
      </Box>
      {task.status === 'running' && (
        <Box width={60}>
          <ProgressBar value={task.progress} />
          <Text> {task.progress}%</Text>
        </Box>
      )}
    </Box>
  );
};

export const TaskQueueStatus: React.FC<{
  tasks: Task[];
  runningTasks: Task[];
  queuedTasks: Task[];
  completedTasks: Task[];
  totalProgress: number;
  concurrencyLimit: number;
}> = ({ 
  tasks, 
  runningTasks, 
  queuedTasks, 
  completedTasks, 
  totalProgress,
  concurrencyLimit
}) => {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="gray" padding={1}>
      <Text bold>Queue Status</Text>
      <Box>
        <Box width={16}><Text>Total Tasks:</Text></Box>
        <Text>{tasks.length}</Text>
      </Box>
      <Box>
        <Box width={16}><Text>Running:</Text></Box>
        <Text color="yellow">{runningTasks.length}</Text>
      </Box>
      <Box>
        <Box width={16}><Text>Queued:</Text></Box>
        <Text color="blue">{queuedTasks.length}</Text>
      </Box>
      <Box>
        <Box width={16}><Text>Completed:</Text></Box>
        <Text color="green">{completedTasks.filter((t: Task) => t.status === 'success').length}</Text>
      </Box>
      <Box>
        <Box width={16}><Text>Failed:</Text></Box>
        <Text color="red">{completedTasks.filter((t: Task) => t.status === 'error').length}</Text>
      </Box>
      <Box>
        <Box width={16}><Text>Concurrency:</Text></Box>
        <Text>{concurrencyLimit}</Text>
      </Box>
      <Box marginTop={1}>
        <Text>Overall Progress:</Text>
      </Box>
      <Box width={40}>
        <ProgressBar value={totalProgress} />
        <Text> {totalProgress}%</Text>
      </Box>
    </Box>
  );
};

export const TaskDashboard: React.FC<{
  runningTasks: Task[];
  tasks: Task[];
  runningTasksCount: number;
  queuedTasks: Task[];
  completedTasks: Task[];
  totalProgress: number;
  concurrencyLimit: number;
}> = ({ 
  runningTasks,
  tasks,
  queuedTasks,
  completedTasks,
  totalProgress,
  concurrencyLimit
}) => {
  return (
    <Box flexDirection="row">
      <Box flexDirection="column" width="70%">
        <Text bold underline>Active Tasks</Text>
        {runningTasks.length === 0 ? (
          <Text>No tasks currently running</Text>
        ) : (
          runningTasks.map((task: Task) => (
            <TaskProgress key={task.id} task={task} />
          ))
        )}
      </Box>
      <Box width="30%">
        <TaskQueueStatus 
          tasks={tasks}
          runningTasks={runningTasks}
          queuedTasks={queuedTasks}
          completedTasks={completedTasks}
          totalProgress={totalProgress}
          concurrencyLimit={concurrencyLimit}
        />
      </Box>
    </Box>
  );
};

export const TaskQueueExample: React.FC = () => {
  const {
    tasks,
    runningTasks,
    queuedTasks,
    completedTasks,
    totalProgress,
    addTask,
    processQueue
  } = useTaskQueue(3);
  
  useEffect(() => {
    for (let i = 1; i <= 10; i++) {
      addTask(`Task ${i}`, { id: i, data: `Sample data ${i}` });
    }
    
    const timer = setTimeout(() => {
      processQueue(async (payload: any, onProgress: (progress: number) => void) => {
        for (let progress = 0; progress <= 100; progress += 5) {
          onProgress(progress);
          await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
        }
        return { processed: true, result: `Processed ${payload.id}` };
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [addTask, processQueue]);
  
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text backgroundColor="blue" color="white" bold>
          Lingo.dev Translation Tasks
        </Text>
      </Box>
      <TaskDashboard 
        runningTasks={runningTasks}
        tasks={tasks}
        runningTasksCount={runningTasks.length}
        queuedTasks={queuedTasks}
        completedTasks={completedTasks}
        totalProgress={totalProgress}
        concurrencyLimit={3}
      />
    </Box>
  );
};

export default function TaskQueueUI() {
  return <TaskQueueExample />;
}
