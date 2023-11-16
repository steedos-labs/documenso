import * as React from 'react';

import { Loader } from 'lucide-react';

import { cn } from '../lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
          {
            'ring-2 !ring-red-500 transition-all': props['aria-invalid'],
          },
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

const InputWithLoader = React.forwardRef<HTMLInputElement, InputProps & { loading?: boolean }>(
  ({ loading, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Input ref={ref} {...props} className={`pr-8 ${props.className}`} />

        {loading && (
          <div className="absolute bottom-0 right-0 top-0 flex h-full items-center justify-center">
            <Loader className="text-muted-foreground mr-2 h-5 w-5 animate-spin" />
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
InputWithLoader.displayName = 'InputWithLoader';

export { Input, InputWithLoader };
