
import React from 'react';

interface InfoCardProps {
    title: string;
    description: string;
    icon?: string;
    source?: string;
    borderColor?: string;
    titleColor?: string;
    onClick: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, description, icon, source, borderColor = 'border-gray-300', titleColor = 'text-gray-800', onClick }) => {
    return (
        <div 
            onClick={onClick}
            className={`card p-6 rounded-lg shadow-md text-center border-t-4 ${borderColor} bg-white transition-all duration-300 ease-in-out hover:transform hover:-translate-y-2 hover:shadow-xl cursor-pointer`}
        >
            {icon && <div className="text-6xl mb-4">{icon}</div>}
            <h3 className={`text-2xl font-bold ${titleColor} mb-2`}>{title}</h3>
            {source && <p className="font-semibold text-gray-700 mb-2">{source}</p>}
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

export default InfoCard;
