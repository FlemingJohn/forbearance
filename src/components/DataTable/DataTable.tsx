import type { ReactNode } from "react";
import "./DataTable.css";

interface DataTableProps {
  headings: string[];
  caption: string;
  children: ReactNode;
}

export function DataTable({ headings, caption, children }: DataTableProps) {
  return (
    <div className="data-table-scroll">
      <table className="data-table">
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            {headings.map((heading) => (
              <th key={heading} scope="col">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
