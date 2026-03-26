type PreviewDescriptionProps = {
  description: string;
};

export const PreviewDescription = ({ description }: PreviewDescriptionProps) => {
  if (!description) return null;

  return (
    <div className="space-y-1 text-sm text-muted-foreground">
      <p className="text-xs text-foreground">{description}</p>
    </div>
  );
};
