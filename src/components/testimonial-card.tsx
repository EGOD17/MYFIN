
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

type TestimonialCardProps = {
  name: string;
  initials: string;
  comment: string;
};

export function TestimonialCard({ name, initials, comment }: TestimonialCardProps) {
  return (
    <Card className="bg-secondary p-4">
      <CardContent className="p-0 flex items-start gap-4">
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-bold text-primary">{name}</p>
          <p className="text-sm text-muted-foreground mt-1">"{comment}"</p>
        </div>
      </CardContent>
    </Card>
  );
}

    