/**
 * Mock Data - Author Manuscripts List
 * Demo data for author manuscripts page
 */

export interface AuthorManuscript {
  id: string;
  title: string;
  description: string;
  status: 'DRAFT' | 'EDITING' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'REJECTED';
  wordCount: number;
  genre: string[];
  createdAt: string;
  updatedAt: string;
  versions: number;
}

export const mockAuthorManuscripts: AuthorManuscript[] = [
  {
    id: '1',
    title: 'The Crystal Kingdom',
    description: 'A fantasy epic about a young princess who discovers she holds the key to an ancient magic.',
    status: 'REVIEW',
    wordCount: 95000,
    genre: ['Fantasy', 'Young Adult'],
    createdAt: '2024-10-15',
    updatedAt: '2024-12-20',
    versions: 3,
  },
  {
    id: '2',
    title: 'Whispers in the Wind',
    description: 'A contemporary romance set in a small coastal town.',
    status: 'EDITING',
    wordCount: 72000,
    genre: ['Romance', 'Contemporary'],
    createdAt: '2024-09-01',
    updatedAt: '2024-12-15',
    versions: 5,
  },
  {
    id: '3',
    title: 'Beyond the Horizon',
    description: 'A science fiction adventure exploring the first human colony on Mars.',
    status: 'DRAFT',
    wordCount: 45000,
    genre: ['Science Fiction'],
    createdAt: '2024-11-20',
    updatedAt: '2024-12-01',
    versions: 1,
  },
  {
    id: '4',
    title: 'The Midnight Garden',
    description: 'A Victorian gothic tale of mystery and magic.',
    status: 'PUBLISHED',
    wordCount: 88000,
    genre: ['Fantasy', 'Historical Fiction'],
    createdAt: '2024-01-10',
    updatedAt: '2024-03-15',
    versions: 7,
  },
  {
    id: '5',
    title: 'Shadows of Tomorrow',
    description: 'A dystopian thriller about a society controlled by artificial intelligence.',
    status: 'APPROVED',
    wordCount: 82000,
    genre: ['Thriller', 'Science Fiction'],
    createdAt: '2024-06-15',
    updatedAt: '2024-11-01',
    versions: 4,
  },
];
