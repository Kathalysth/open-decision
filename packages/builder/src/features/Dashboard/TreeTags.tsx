import { IconButton, Badge } from "@open-legal-tech/design-system";
import React from "react";
import { Plus } from "react-feather";
import { ValidTreeNode } from "./types";

type TreeTagsProps = { tree: ValidTreeNode };

export const TreeTags: React.FC<TreeTagsProps> = ({ tree }) => {
  return (
    <div className="space-x-4 flex items-center">
      {tree.tags.map((tag) => (
        <Badge key={tag.name} color={tag.color} css={{ boxShadow: "$sm" }}>
          {tag.name}
        </Badge>
      ))}
      <IconButton
        alignByContent="left"
        variant="ghost"
        round
        size="small"
        label="Tag hinzufügen"
        Icon={<Plus className="w-6 h-6" />}
      />
    </div>
  );
};
