
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Facebook, Send, Video, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingLink } from "@/components/ui/loading-link";
import { useToast } from "@/hooks/use-toast";

const COMPLETED_TASKS_KEY = "finpas_completed_tasks";
const SPECIAL_OFFER_CLAIMED_KEY = "finpas_special_offer_claimed";
const ACTIVE_TIMED_TASK_KEY = "finpas_active_timed_task";

type TaskId = "video" | "facebookLike" | "telegram" | "youtube" | "tiktok" | "facebookFollow" | "instagram" | "xFollow";

type TaskInfo = {
    id: TaskId;
    name: string;
    url: string;
    icon: React.FC<any>;
    iconClassName: string;
    description: string;
    timer?: number; // Optional timer in seconds
};

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 8.5v8.5a4 4 0 1 0 4-4H12"/>
        <path d="M16 4.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/>
    </svg>
)

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M18 6 6 18"/>
        <path d="m6 6 12 12"/>
    </svg>
);

const TASKS_CONFIG: TaskInfo[] = [
    { id: "video", name: "Watch Video Ad", url: "https://ryuzagoncalves.com.br/ZW4vNHE1MTR1OFo5YzdFNXg=", icon: Video, iconClassName: "text-primary", description: "Watch a short video.", timer: 10 },
    { id: "facebookLike", name: "Like Facebook Post", url: "https://facebook.com/myfinng", icon: Facebook, iconClassName: "text-blue-600", description: "Like our latest post.", timer: 10 },
    { id: "facebookFollow", name: "Follow Facebook Page", url: "https://facebook.com/myfinng", icon: Facebook, iconClassName: "text-blue-800", description: "Follow our page.", timer: 5 },
    { id: "instagram", name: "Follow on Instagram", url: "https://www.instagram.com/myfinng", icon: InstagramIcon, iconClassName: "text-[#E1306C]", description: "Follow our Instagram page.", timer: 5 },
    { id: "xFollow", name: "Follow page on X", url: "https://x.com/myfinng", icon: XIcon, iconClassName: "", description: "Follow our page on X.", timer: 5 },
    { id: "telegram", name: "Join Telegram Channel", url: "https://ryuzagoncalves.com.br/ZW4vNHE1MTR1OFo5YzdFNXg=", icon: Send, iconClassName: "text-sky-500", description: "Join our community channel.", timer: 5 },
    { id: "youtube", name: "Watch YouTube Video", url: "https://youtube.com/@myfinng", icon: Youtube, iconClassName: "text-red-600", description: "Watch one of our videos.", timer: 10 },
    { id: "tiktok", name: "Watch TikTok Video", url: "https://www.tiktok.com/@myfinng", icon: TikTokIcon, iconClassName: "", description: "Watch one of our videos.", timer: 10 },
];

const TIMED_TASKS_CONFIG = TASKS_CONFIG.filter(task => task.timer);
const ALL_TASK_IDS = TASKS_CONFIG.map(t => t.id);

type CompletedTasks = {
    [key in TaskId]?: boolean
}

export default function TasksPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [completedTasks, setCompletedTasks] = useState<CompletedTasks>({});
  const [offerClaimed, setOfferClaimed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCompleted = localStorage.getItem(COMPLETED_TASKS_KEY);
      if (storedCompleted) {
        setCompletedTasks(JSON.parse(storedCompleted));
      }
      const claimed = localStorage.getItem(SPECIAL_OFFER_CLAIMED_KEY);
      if (claimed === "true") {
        setOfferClaimed(true);
      }
    }
  }, []);

  const handleVisibilityChange = useCallback(() => {
      if (document.visibilityState === 'hidden') {
          const activeTaskID = localStorage.getItem(ACTIVE_TIMED_TASK_KEY);
          const task = TIMED_TASKS_CONFIG.find(t => t.id === activeTaskID);
          if (task) {
              const taskStartTimeKey = `finpas_${task.id}_start`;
              localStorage.setItem(taskStartTimeKey, Date.now().toString());
              localStorage.removeItem(ACTIVE_TIMED_TASK_KEY);
          }
      }

      if (document.visibilityState === 'visible') {
          TIMED_TASKS_CONFIG.forEach(task => {
              const taskStartTimeKey = `finpas_${task.id}_start`;
              const startTimeStr = localStorage.getItem(taskStartTimeKey);

              if (startTimeStr) {
                  const startTime = parseInt(startTimeStr, 10);
                  const timeSpent = (Date.now() - startTime) / 1000;
                  localStorage.removeItem(taskStartTimeKey);

                  if (timeSpent >= task.timer!) {
                      toast({ title: "Task Complete!", description: `You've completed the "${task.name}" task.` });
                      setCompletedTasks(prevTasks => {
                          const updatedTasks = { ...prevTasks, [task.id]: true };
                          localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(updatedTasks));
                          return updatedTasks;
                      });
                  } else {
                      toast({ title: "Task Incomplete", description: `You didn't spend enough time on the ${task.name} task.`, variant: "destructive" });
                  }
              }
          });
      }
  }, [toast]);


  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);
  
  const allTasksCompleted = ALL_TASK_IDS.every(task => completedTasks[task]);

  const getLinkWithParams = (pathname: string) => {
    const params = new URLSearchParams(searchParams.toString());
    return `${pathname}?${params.toString()}`;
  };

  useEffect(() => {
    if (allTasksCompleted && !offerClaimed) {
      toast({
        title: "All Tasks Completed!",
        description: "Redirecting you to the miner store to claim your reward.",
      });
      const timer = setTimeout(() => {
        router.push(getLinkWithParams('/dashboard/buy-miner'));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [allTasksCompleted, offerClaimed, router, toast, searchParams]);

  const handleTaskClick = (task: TaskInfo) => {
     if (typeof window !== "undefined") {
        if (completedTasks[task.id]) return;

        if (task.timer) {
            // Flag this task as the one to be timed when the user leaves the page.
            localStorage.setItem(ACTIVE_TIMED_TASK_KEY, task.id);
        } else {
            // It's an instant-complete task
            toast({ title: "Task Complete!", description: `You've completed the "${task.name}" task.` });
            setCompletedTasks(prevTasks => {
                const updatedTasks = { ...prevTasks, [task.id]: true };
                localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(updatedTasks));
                return updatedTasks;
            });
        }
        window.open(task.url, '_blank');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <LoadingLink
        href={getLinkWithParams("/dashboard")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </LoadingLink>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Complete Tasks, Get Rewards</CardTitle>
          <CardDescription>
            Complete all the simple tasks below to unlock a special offer: 10 taps for only {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(100)}!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {TASKS_CONFIG.map((task) => {
            const Icon = task.icon;
            const isCompleted = completedTasks[task.id];
            return (
              <Card key={task.id} className="flex items-center justify-between p-4 bg-secondary">
                <div className="flex items-center gap-4">
                  <Icon className={`h-8 w-8 ${task.iconClassName}`} />
                  <div>
                    <h3 className="font-bold">{task.name}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                </div>
                <Button onClick={() => handleTaskClick(task)} disabled={isCompleted}>
                  {isCompleted ? "Completed" : "Go"}
                </Button>
              </Card>
            )
          })}

          {allTasksCompleted && (
            <div className="pt-4 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
               {offerClaimed ? (
                <>
                    <h3 className="text-lg font-bold text-green-500">Offer Claimed!</h3>
                    <p className="text-muted-foreground mb-4">
                        You have already claimed the special offer for today. Check back tomorrow!
                    </p>
                </>
              ) : (
                 <p className="text-muted-foreground mb-4">
                    Redirecting you to the miner store...
                 </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
