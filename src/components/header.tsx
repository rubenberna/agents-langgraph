import { useState } from "react";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import DiagramDialog from "../features/csHelper/diagramDialog";

export default function Header({
  src,
  title,
  subtitle,
  dialogText,
}: {
  src: string | undefined;
  title: string;
  subtitle: string | undefined;
  dialogText?: string;
}) {
  let [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
        {title}
      </h1>
      {subtitle && (
        <div className="flex items-center justify-center gap-2">
          <p className="text-zinc-600 dark:text-zinc-400">{subtitle}</p>
          <LightBulbIcon className="size-5" onClick={open} />
        </div>
      )}
      {src && (
        <DiagramDialog
          isOpen={isOpen}
          onClose={close}
          src={src}
          dialogText={dialogText}
        />
      )}
    </div>
  );
}
