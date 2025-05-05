
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';

interface CreditsDialogProps {
  triggerText: string;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const CreditsDialog: React.FC<CreditsDialogProps> = ({ 
  triggerText, 
  variant = "ghost", 
  size = "sm",
  className 
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>about this quiz - credits</DialogTitle>
          <DialogDescription>
            ---
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p>
            The Life in the UK quiz was made for the helluvit and then we felt it deserved a bigger audience. 
            It was made to test the street-credibility of Ella, a visiting US guest, after 
            studying in the UK for several months.
          </p>
          <p>
            Oli wrote it although he'd sooner be lobbying those able to avert a climate crisis - see his 
            work and songs at <a 
              href="https://olifro.st" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center"
            >
              olifro.st <ExternalLink className="ml-1 h-3 w-3" />
            </a>.
          </p>
          <p>
            His dad, Roger Frost designed the web app - and otherwise he blogs about home automation at <a 
              href="https://rogerfrost.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center"
            >
              rogerfrost.com <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreditsDialog;
