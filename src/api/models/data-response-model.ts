interface Base {
    [key: string]: string | number | undefined;  
}

export interface Book extends Base {
    id: number;
    title: string;
    description: string;
    pageCount: number;
    excerpt: string;
    publishDate: string;
}

export interface Author extends Base {
    id: number;
    idBook: number;
    firstName: string;
    lastName: string;
}