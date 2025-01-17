import { FileInput, FileInputProps } from "@open-decision/design-system";
import * as React from "react";
import { useImport } from "../Data/useImport";

export const TreeImport = React.forwardRef<
  HTMLLabelElement,
  FileInputProps & { onDone?: () => void }
>(function TreeImport({ onDone, children, ...props }, ref) {
  const { mutate: createTree } = useImport({
    onSettled: () => onDone?.(),
  });

  return (
    <FileInput
      ref={ref}
      onChange={(event) => {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
          createTree({ event });
        };

        if (!event.currentTarget.files?.[0]) return;
        fileReader.readAsText(event.currentTarget.files[0]);
        event.target.value = "";
      }}
      {...props}
    >
      {children}
    </FileInput>
  );
});
