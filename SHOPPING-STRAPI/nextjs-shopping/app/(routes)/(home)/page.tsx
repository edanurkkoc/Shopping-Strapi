'use client'
import { ModeToggle } from "@/components/ModeToggle";
import {Button} from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast()
  return (
    <div >
     <button>
      deneme
     </button>
     <Button>
      test
     </Button>
     <Button
      onClick={() => {
        toast({
          variant:"destructive",
          title: "Scheduled: Catch up",
          description: "Friday, February 10, 2023 at 5:57 PM",
        })
      }}
    >
      Show Toast
    </Button>
    <ModeToggle/>
    </div>
  );
}
