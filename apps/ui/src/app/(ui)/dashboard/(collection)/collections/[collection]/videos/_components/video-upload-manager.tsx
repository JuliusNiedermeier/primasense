'use client';

import { Card } from '@/app/(ui)/_components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/app/(ui)/_components/ui/collapsible';
import { Progress } from '@/app/(ui)/_components/ui/progress';
import { cn } from '@/app/(ui)/_utils/cn';
import { useVideoUpload } from '@/app/(ui)/dashboard/_components/video-upload-provider';
import { ChevronUp } from 'lucide-react';
import { FC, useState } from 'react';

type VideoUploadManagerProps = {};

export const VideoUploadManager: FC<VideoUploadManagerProps> = () => {
  const { uploads } = useVideoUpload();

  const [expanded, setExpanded] = useState(false);

  const totalProgress = uploads.reduce((sum, upload) => sum + upload.progress, 0) / uploads.length;

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded} asChild>
      <Card className="w-80 overflow-hidden">
        <CollapsibleContent>
          <div className="max-h-96 overflow-y-auto">
            {uploads.map((upload) => (
              <div key={upload.videoID} className="p-4 border-t">
                <span className="block w-full whitespace-nowrap overflow-hidden text-ellipsis text-sm">{upload.title}</span>
                <Progress value={upload.progress * 100} className="h-1" />
                <span className="text-muted-foreground text-sm">{upload.status}</span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
        <CollapsibleTrigger className={cn('p-4 w-full', { 'bg-muted': expanded })}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium block mb-1">
              {uploads.length} pending {uploads.length === 1 ? 'upload' : 'uploads'}
            </span>
            <ChevronUp size="16" className={cn({ 'rotate-180': expanded })} />
          </div>
          <Progress value={totalProgress * 100} className="h-1" />
        </CollapsibleTrigger>
      </Card>
    </Collapsible>
  );
};
