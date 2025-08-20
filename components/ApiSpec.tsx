
import React, { useEffect, useState } from 'react';
import { marked } from 'marked';

interface ApiSpecProps {
    content: string;
}

const ApiSpec: React.FC<ApiSpecProps> = ({ content }) => {
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        const parseMarkdown = async () => {
            try {
                const html = await marked.parse(content);
                setHtmlContent(html);
            } catch (error) {
                console.error("Error parsing markdown:", error);
                setHtmlContent("<p>Error loading content.</p>");
            }
        };
        parseMarkdown();
    }, [content]);

    return (
        <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};

export default ApiSpec;
