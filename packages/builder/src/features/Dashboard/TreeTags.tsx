import { Badge, Button, Icon } from "@open-legal-tech/design-system";
import React from "react";
import { Plus } from "react-feather";

// FIXME Remove the any types when it is clear what shape the metadata return from the API has
type TreeTagsProps = { tree: any };

export const TreeTags: React.FC<TreeTagsProps> = ({ tree }) => {
  return (
    <div className="space-x-4 flex items-center">
      {tree.tags.map((tag) => (
        <Badge key={tag.name} color={tag.color} css={{ boxShadow: "$sm" }}>
          {tag.name}
        </Badge>
      ))}
      <Button alignByContent="left" variant="ghost" round size="small">
        <Icon label="Tag hinzufügen">
          {" "}
          <Plus />
        </Icon>
      </Button>
    </div>
  );
};
