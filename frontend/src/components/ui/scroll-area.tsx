import * as React from "react"

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={`relative overflow-auto ${className || ""}`}
    style={{
      // Tùy chỉnh thanh cuộn cho đẹp hơn trên các trình duyệt webkit
      scrollbarWidth: 'thin',
      scrollbarColor: '#CBD5E1 transparent'
    }}
    {...props}
  >
    {children}
    <style dangerouslySetInnerHTML={{__html: `
      .scroll-area-content::-webkit-scrollbar {
        width: 6px;
      }
      .scroll-area-content::-webkit-scrollbar-track {
        background: transparent;
      }
      .scroll-area-content::-webkit-scrollbar-thumb {
        background-color: #CBD5E1;
        border-radius: 20px;
      }
    `}} />
  </div>
))
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }