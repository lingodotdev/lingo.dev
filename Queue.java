
import java.util.LinkedList;
import java.util.Queue;

public class QueueOperation {
    public static void main(String[] args) {
        Queue<Integer> q = new LinkedList<>();
        q.add(10);
        q.add(20);
        q.add(25);
        q.add(65);
        System.out.println(q.poll());
        System.out.println("Front value:-"+q.peek());
        System.out.println(((LinkedList<Integer>) q).getLast() );
        System.out.println("Queue is empty:-"+q.isEmpty());
        System.out.println("Size of Queue:-"+q.size());
      

        
    }
}
