
import React, { useState } from 'react';
import { ClipboardListIcon, UserIcon } from './Icons';

interface ProfileProps {
    ownerId: string;
    isCoachMode: boolean;
    activeClientId: string;
    onLoadClient: (clientId: string) => void;
    onExitCoachMode: () => void;
}

const Profile: React.FC<ProfileProps> = ({ ownerId, isCoachMode, activeClientId, onLoadClient, onExitCoachMode }) => {
    const [coachInputId, setCoachInputId] = useState('');
    const [copied, setCopied] = useState(false);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(ownerId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-200">Profile & Coach Mode</h2>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Your Client ID</h3>
                <p className="text-sm text-gray-400 mb-4">Share this ID with your coach to give them access to your log.</p>
                <div className="flex items-center space-x-2 bg-gray-700 p-2 rounded-md">
                    <span className="font-mono text-emerald-400 text-sm truncate flex-grow">{ownerId}</span>
                    <button 
                        onClick={handleCopyToClipboard}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-2 px-3 rounded-md transition-colors"
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="flex items-center text-lg font-semibold text-gray-300 mb-4">
                    <UserIcon className="w-5 h-5 mr-2" />
                    Coach Mode
                </h3>
                {isCoachMode ? (
                     <div className="space-y-4">
                        <p className="text-gray-300">
                            Currently viewing client: <span className="font-mono text-yellow-400">{activeClientId.substring(0,8)}...</span>
                        </p>
                        <button 
                            onClick={onExitCoachMode}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                        >
                            Return to My Log
                        </button>
                     </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-gray-400 text-sm">Enter a Client ID to view their log and update their schedule.</p>
                        <input 
                            type="text"
                            value={coachInputId} 
                            onChange={(e) => setCoachInputId(e.target.value)}
                            placeholder="Enter Client ID"
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-3"
                         />
                        <button 
                            onClick={() => onLoadClient(coachInputId)}
                            disabled={!coachInputId.trim()}
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            Load Client Data
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
