export function ChatHeader() {
  return (
    <div className="h-15 flex w-full items-center justify-between border-b bg-muted/40 p-4">
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <span className="font-medium">{new Date().toDateString()}</span>
        </div>
      </div>
    </div>
  );
}
