
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
        import Image from 'next/image'; // Assuming you're using Next.js for Image optimization

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

                  </DialogDescription>
                </DialogHeader>

                {/* Added Image Here - Above the text content */}
                <div className="flex justify-center mb-4">
                  <Image
                    src="http://googleusercontent.com/image_generation_content/0" // Use the generated image URL
                    alt="Decorative credits image"
                    width={300} // Adjust width as needed
                    height={150} // Adjust height as needed
                    className="rounded-md" // Optional: Add rounded corners
                    priority // Optional: If it's important for initial render
                  />
                </div>

                <div className="space-y-4 py-2">
                  <p>
                    This quiz was made to test the street-credibility of Ella, a visiting US guest, after
                    studying in the UK for several months. But then we thought to give it a wider audience.
                  </p>
                  <p>
                    Oli F wrote it although he'd sooner be lobbying those able to avert a climate crisis - see his
                    work and award-winning songs at <a
                      href="https://olifro.st"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center"
                    >
                      olifro.st <ExternalLink className="ml-1 h-3 w-3" />
                    </a>.
                  </p>
                  <p>
                    His dad, Roger F 'coded' the app in lovable.dev - his hobby is home automation and sensors
   
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          );
        };

        export default CreditsDialog;
