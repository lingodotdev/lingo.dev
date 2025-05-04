import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
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

interface TaskContextType {
  tasks: Task[];
  runningTasks: Task[];
  queuedTasks: Task[];
  completedTasks: Task[];
  addTask: (name: string, payload: any) => string;
  removeTask: (id: string) => void;
  startProcessing: (processFn: (payload: any, onProgress: (progress: number) => void) => Promise<any>) => Promise<void>;
  totalProgress: number;
  concurrency: number;
  setConcurrency: (value: number) => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

const generateId = () => Math.random().toString(36).substring(2, 9);

export const TaskProvider: React.FC<{ children: React.ReactNode; initialConcurrency?: number }> = ({ 
  children, 
  initialConcurrency = 3 
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [concurrency, setConcurrency] = useState(initialConcurrency);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const runningTasks = useMemo(() => tasks.filter((t: Task) => t.status === 'running'), [tasks]);
  const queuedTasks = useMemo(() => tasks.filter((t: Task) => t.status === 'idle'), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((t: Task) => ['success', 'error'].includes(t.status)), [tasks]);
  
  const totalProgress = useMemo(() => {
    if (tasks.length === 0) return 0;
    const totalProgress = tasks.reduce((sum: number, task: Task) => sum + task.progress, 0);
    return Math.floor(totalProgress / tasks.length);
  }, [tasks]);
  
  const addTask = useCallback((name: string, payload: any) => {
    const id = generateId();
    setTasks((prev: Task[]) => [...prev, {
      id,
      name,
      status: 'idle',
      progress: 0,
      payload
    }]);
    return id;
  }, []);
  
  const removeTask = useCallback((id: string) => {
    setTasks((prev: Task[]) => prev.filter((task: Task) => task.id !== id));
  }, []);
  
  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev: Task[]) => prev.map((task: Task) => 
      task.id === id ? { ...task, status } : task
    ));
  }, []);
  
  const updateTaskProgress = useCallback((id: string, progress: number) => {
    setTasks((prev: Task[]) => prev.map((task: Task) => 
      task.id === id ? { ...task, progress } : task
    ));
  }, []);
  
  const updateTaskResult = useCallback((id: string, result: any) => {
    setTasks((prev: Task[]) => prev.map((task: Task) => 
      task.id === id ? { ...task, result } : task
    ));
  }, []);
  
  const updateTaskError = useCallback((id: string, error: Error) => {
    setTasks((prev: Task[]) => prev.map((task: Task) => 
      task.id === id ? { ...task, error } : task
    ));
  }, []);
  
  const startProcessing = useCallback(async (
    processFn: (payload: any, onProgress: (progress: number) => void) => Promise<any>
  ) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    const limit = pLimit(concurrency);
    
    const processTask = async (task: Task) => {
      try {
        updateTaskStatus(task.id, 'running');
        
        const result = await processFn(
          task.payload, 
          (progress: number) => updateTaskProgress(task.id, progress)
        );
        
        updateTaskResult(task.id, result);
        updateTaskStatus(task.id, 'success');
        return result;
      } catch (error) {
        updateTaskError(task.id, error as Error);
        updateTaskStatus(task.id, 'error');
        throw error;
      }
    };
    
    try {
      const idleTasks = tasks.filter((t: Task) => t.status === 'idle');
      await Promise.all(idleTasks.map((task: Task) => limit(() => processTask(task))));
    } finally {
      setIsProcessing(false);
    }
  }, [tasks, concurrency, isProcessing, updateTaskStatus, updateTaskProgress, updateTaskResult, updateTaskError]);
  
  const value = {
    tasks,
    runningTasks,
    queuedTasks,
    completedTasks,
    addTask,
    removeTask,
    startProcessing,
    totalProgress,
    concurrency,
    setConcurrency
  };
  
  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskQueue = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskQueue must be used within a TaskProvider');
  }
  return context;
};

export const useTask = (taskFn: () => Promise<any>, dependencies: any[] = []) => {
  const [status, setStatus] = useState<TaskStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    const runTask = async () => {
      try {
        setStatus('running');
        const res = await taskFn();
        if (isMounted) {
          setResult(res);
          setStatus('success');
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setStatus('error');
        }
      }
    };
    
    runTask();
    
    return () => {
      isMounted = false;
    };
  }, dependencies);
  
  return { status, progress, result, error, setProgress };
};

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

export const TaskQueueStatus: React.FC = () => {
  const { 
    tasks, 
    runningTasks, 
    queuedTasks, 
    completedTasks, 
    totalProgress,
    concurrency
  } = useTaskQueue();
  
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
        <Text>{concurrency}</Text>
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

export const TaskDashboard: React.FC = () => {
  const { runningTasks } = useTaskQueue();
  
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
        <TaskQueueStatus />
      </Box>
    </Box>
  );
};

export const TaskExample: React.FC = () => {
  const { addTask, startProcessing } = useTaskQueue();
  
  useEffect(() => {
    for (let i = 1; i <= 10; i++) {
      addTask(`Task ${i}`, { id: i, data: `Sample data ${i}` });
    }
    
    const timer = setTimeout(() => {
      startProcessing(async (payload: any, onProgress: (progress: number) => void) => {
        for (let progress = 0; progress <= 100; progress += 5) {
          onProgress(progress);
          await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
        }
        return { processed: true, result: `Processed ${payload.id}` };
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [addTask, startProcessing]);
  
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text backgroundColor="blue" color="white" bold>
          Lingo.dev Translation Tasks
        </Text>
      </Box>
      <TaskDashboard />
    </Box>
  );
};

export default function TaskProgressUI() {
  return (
    <TaskProvider initialConcurrency={3}>
      <TaskExample />
    </TaskProvider>
  );
}
