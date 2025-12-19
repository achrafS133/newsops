import * as React from "react"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number
    indicatorClassName?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value, indicatorClassName, ...props }, ref) => (
        <div
            ref={ref}
            className={`relative h-2 w-full overflow-hidden rounded-full bg-white/10 ${className || ''}`}
            {...props}
        >
            <div
                className={`h-full w-full flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500 ${indicatorClassName || ''}`}
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </div>
    )
)
Progress.displayName = "Progress"

export { Progress }
