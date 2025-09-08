import Link from 'next/link';

interface Heading {
  level: number;
  text: string;
  id: string;
}

interface TableOfContentsProps {
  headings: Heading[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-20 p-3 border rounded-lg shadow-md bg-white dark:bg-gray-800">
      <h2 className="text-base font-bold mb-4 text-gray-900 dark:text-white">目次</h2>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id} className={`ml-${(heading.level - 2) * 4} text-xs`}>
            <Link
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`hover:underline ${
                heading.level === 2
                  ? 'font-bold text-orange-700 dark:text-orange-300' // H2: bold, darker orange
                  : heading.level === 3
                  ? 'text-orange-500 dark:text-orange-400' // H3: normal weight, lighter orange
                  : 'text-orange-600 dark:text-orange-400' // Default for H4+
              }`}
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
