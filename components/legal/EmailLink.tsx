// components/legal/EmailLink.tsx
// Turbopack misparses multiline <a> tags inside JSX prose paragraphs.
// Wrapping email links in this component keeps them single-line at the
// call site and eliminates the parse error across all legal pages.

type EmailLinkProps = {
  address: string;
};

export default function EmailLink({ address }: EmailLinkProps) {
  return (
    <a href={`mailto:${address}`} className="text-[#7C9A6B] hover:underline">
      {address}
    </a>
  );
}
