export default function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
      <div className={`px-4 md:px-10 flex justify-center ${className}`}>
        <div className="w-full max-w-[960px]">{children}</div>
      </div>
    );
  }