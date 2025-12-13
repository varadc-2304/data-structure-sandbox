import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent } from '@/components/ui/card';
import { Mail } from 'lucide-react';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, className = '' }) => {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2 mt-8" {...props}>
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              {props.children}
            </h2>
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-semibold text-foreground mb-3 mt-6" {...props} />
          ),
          p: ({ node, ...props }) => {
            const text = String(props.children || '');
            // Check if paragraph contains email link
            if (text.includes('ikshvaku.innovations@gmail.com') || text.includes('📧')) {
              return (
                <p className="text-base text-foreground leading-relaxed mb-4" {...props}>
                  {text.split(/(ikshvaku\.innovations@gmail\.com|📧)/).map((part, i) => {
                    if (part === 'ikshvaku.innovations@gmail.com') {
                      return (
                        <a
                          key={i}
                          href={`mailto:${part}`}
                          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                          <Mail className="h-5 w-5" />
                          {part}
                        </a>
                      );
                    }
                    if (part === '📧') {
                      return <span key={i}>{part} </span>;
                    }
                    return <span key={i}>{part}</span>;
                  })}
                </p>
              );
            }
            return <p className="text-base text-foreground leading-relaxed mb-4" {...props} />;
          },
          ul: ({ node, ...props }) => (
            <ul className="space-y-2 ml-4 mb-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="space-y-2 ml-4 mb-4 list-decimal" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="flex items-start gap-3" {...props}>
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2.5"></span>
              <span className="text-base text-foreground">{props.children}</span>
            </li>
          ),
          strong: ({ node, ...props }) => (
            <strong className="text-foreground font-semibold" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="text-foreground italic" {...props} />
          ),
          a: ({ node, ...props }) => {
            const href = props.href || '';
            if (href.startsWith('mailto:')) {
              return (
                <a
                  {...props}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  {props.children}
                </a>
              );
            }
            return (
              <a
                {...props}
                className="text-primary hover:text-primary/80 underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              />
            );
          },
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4" {...props} />
          ),
          code: ({ node, inline, ...props }) => {
            if (inline) {
              return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
              );
            }
            return (
              <code className="block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto" {...props} />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;

