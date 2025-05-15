import React from 'react';
import { UserCircle } from 'lucide-react';
import { User } from '../types';

interface LawyerCardProps {
  lawyer: User;
  selected: boolean;
  onClick: (lawyerId: string) => void;
}

const LawyerCard: React.FC<LawyerCardProps> = ({ lawyer, selected, onClick }) => {
  return (
    <div 
      className={`p-4 border-b hover:bg-blue-50 cursor-pointer transition duration-150 ${
        selected ? 'bg-blue-50' : ''
      }`}
      onClick={() => onClick(lawyer.id)}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <UserCircle className="text-blue-600" size={20} />
        </div>
        <div className="ml-3">
          <p className="font-medium">{lawyer.name}</p>
          <p className="text-sm text-gray-500">{lawyer.email}</p>
        </div>
      </div>
    </div>
  );
};

export default LawyerCard;