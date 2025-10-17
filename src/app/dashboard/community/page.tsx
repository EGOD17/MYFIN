
"use client";

import { LoadingLink } from "@/components/ui/loading-link";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TestimonialCard } from "@/components/testimonial-card";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { OfficialReplyCard } from "@/components/official-reply-card";

type Testimonial = {
    name: string;
    initials: string;
    comment: string;
};

const initialTestimonials: Testimonial[] = [
  {
    name: "Blessing A.",
    initials: "BA",
    comment: "I was so worried! The withdrawal was pending for an hour. I almost gave up, but then I got an alert for 50k and an apology message. My Fin NG is the best!",
  },
  {
    name: "Chinedu O.",
    initials: "CO",
    comment: "I thought it was a joke. Waited 30 mins, nothing. Then BAM! 75,000 NGN in my account. This app is the real deal, just be patient.",
  },
  {
    name: "Fatima B.",
    initials: "FB",
    comment: "My withdrawal took about 45 minutes. I was getting nervous, but the customer support was responsive. Finally got my 60k. So relieved!",
  },
  {
    name: "Tunde S.",
    initials: "TS",
    comment: "I can't believe it. I was about to complain after an hour of waiting, then the 100k dropped. This is a lifesaver! Thank you!",
  },
  {
    name: "Aisha I.",
    initials: "AI",
    comment: "Waited for what felt like forever, but it was just 90 minutes. Seeing that 80,000 NGN alert made it all worth it. My rent is sorted!",
  },
  {
    name: "Emeka N.",
    initials: "EN",
    comment: "The customer support is amazing! I had an issue, they resolved it, and I got my 50k with an apology for the delay. Trustworthy platform.",
  },
  {
    name: "Ngozi E.",
    initials: "NE",
    comment: "I've tried many apps, but this is the only one that actually pays. The wait can be stressful, but the money always comes. Got my 120k!",
  },
  {
    name: "Musa K.",
    initials: "MK",
    comment: "My first withdrawal of 55k was delayed. I was scared, but it came through. This app is more than just an app; it's a lifeline.",
  },
  {
    name: "Funke A.",
    initials: "FA",
    comment: "Don't panic if it takes a while! I got my 95k after two hours. The returns are incredible, just hold on. It's real!",
  },
  {
    name: "Ibrahim L.",
    initials: "IL",
    comment: "Simple, transparent, and profitable. The one-hour wait for my 70k was nerve-wracking but worth it. My Fin NG is the best.",
  },
  {
    name: "Chioma P.",
    initials: "CP",
    comment: "I almost gave up after my withdrawal request for 50k was pending for so long. And now, I just received it! With an apology. Am so happy!",
  },
  {
    name: "Abubakar G.",
    initials: "AG",
    comment: "The daily reset is real! I missed a withdrawal and my balance vanished. Lesson learned. Withdrew 65k today, didn't waste time!",
  },
  {
    name: "Folake O.",
    initials: "FO",
    comment: "This app has given me financial freedom I never thought possible. That first 85k withdrawal felt like a miracle after the long wait.",
  },
  {
    name: "David A.",
    initials: "DA",
    comment: "My 50k was delayed, and I was about to post a bad review. Then I got the credit alert. This thing works! You just have to be patient.",
  },
  {
    name: "Zainab S.",
    initials: "ZS",
    comment: "It's amazing to see my balance grow every day. The 45-minute wait for my first 50k was intense, but the feeling of security is priceless now.",
  },
  {
    name: "Oluwaseun M.",
    initials: "OM",
    comment: "I finally cleared my rent because of this app. The 70k withdrawal took its time, but it came. God bless the creators.",
  },
  {
    name: "Halima B.",
    initials: "HB",
    comment: "Don't hesitate, just start. And when you withdraw, don't panic. The 60k will come. It's life-changing.",
  },
  {
    name: "Victor U.",
    initials: "VU",
    comment: "The best part is the community. Reading these comments kept me calm during my 90-minute wait for 110k. We're all winning together.",
  },
  {
    name: "Gift E.",
    initials: "GE",
    comment: "I'm a student and this app helps me cover expenses. The wait for my 50k felt like an exam, but I passed! It's fantastic.",
  },
  {
    name: "Samuel J.",
    initials: "SJ",
    comment: "A true financial breakthrough! My first 150k took almost 3 hours, my heart was in my mouth. But it came! I'm starting a business now.",
  },
];

const USER_TESTIMONIALS_KEY = "user_testimonials";

export default function CommunityPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [newComment, setNewComment] = useState("");
  const [isClient, setIsClient] = useState(false);
  
  const userName = searchParams.get("name") || "User";

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const storedTestimonials = localStorage.getItem(USER_TESTIMONIALS_KEY);
      if (storedTestimonials) {
        try {
          const parsedTestimonials: Testimonial[] = JSON.parse(storedTestimonials);
          setTestimonials(prev => [...initialTestimonials, ...parsedTestimonials]);
        } catch (e) {
          console.error("Failed to parse testimonials from localStorage", e);
        }
      }
    }
  }, []);

  const getLinkWithParams = (pathname: string) => {
    const params = new URLSearchParams(searchParams.toString());
    return `${pathname}?${params.toString()}`;
  };
  
  const getInitials = (name: string) => {
      const names = name.split(' ');
      if (names.length > 1) {
          return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
  }

  const handlePostComment = () => {
    if (newComment.trim() === "") {
        toast({
            title: "Comment cannot be empty",
            variant: "destructive"
        });
        return;
    }
    
    const userTestimonial: Testimonial = {
        name: userName,
        initials: getInitials(userName),
        comment: newComment,
    };
    
    // Update state to show comment immediately
    setTestimonials(prev => [...prev, userTestimonial]);
    
    // Update localStorage
    if(isClient) {
        const storedTestimonials = localStorage.getItem(USER_TESTIMONIALS_KEY);
        const existing: Testimonial[] = storedTestimonials ? JSON.parse(storedTestimonials) : [];
        const updatedTestimonials = [...existing, userTestimonial];
        localStorage.setItem(USER_TESTIMONIALS_KEY, JSON.stringify(updatedTestimonials));
        setTestimonials([...initialTestimonials, ...updatedTestimonials]);
    }
    
    setNewComment("");
    toast({
        title: "Comment posted!",
        description: "Thank you for sharing your story.",
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <LoadingLink href={getLinkWithParams("/dashboard")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </LoadingLink>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Community Hub</CardTitle>
          <CardDescription>See how My Fin NG is helping others achieve financial freedom.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[50vh] w-full">
            <div className="space-y-4 p-4">
              <OfficialReplyCard />
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  name={testimonial.name}
                  initials={testimonial.initials}
                  comment={testimonial.comment}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4 pt-4 border-t">
            <div className="w-full space-y-2">
                <label htmlFor="comment" className="font-medium">Share your story</label>
                <Textarea 
                    id="comment"
                    placeholder="Write your testimonial here..." 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="bg-secondary"
                />
            </div>
            <Button onClick={handlePostComment} disabled={!newComment.trim()}>Post Comment</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    
