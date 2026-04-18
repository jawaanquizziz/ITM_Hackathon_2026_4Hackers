import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Plus, Trash2 } from 'lucide-react';
import { NeonButton } from '../ui/NeonButton';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const suggestedMembers = [
  { id: '1', name: 'Alex Chen', avatar: '👤' },
  { id: '2', name: 'Sarah Miller', avatar: '👩' },
  { id: '3', name: 'Mike Johnson', avatar: '👨' },
  { id: '4', name: 'Emma Davis', avatar: '👩‍🦰' },
  { id: '5', name: 'James Wilson', avatar: '🧔' },
];

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState('');

  const handleAddMember = () => {
    if (newMember && !members.includes(newMember)) {
      setMembers([...members, newMember]);
      setNewMember('');
    }
  };

  const handleRemoveMember = (member: string) => {
    setMembers(members.filter((m) => m !== member));
  };

  const handleAddSuggested = (id: string) => {
    const member = suggestedMembers.find((m) => m.id === id);
    if (member && !members.includes(member.name)) {
      setMembers([...members, member.name]);
    }
  };

  const handleSubmit = () => {
    // Handle group creation
    console.log({ name, members });
    onClose();
  };

  return (
    /* @ts-ignore */
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#111118] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">Create New Group</h2>
                <p className="text-white/50 text-sm mt-1">Start splitting expenses with friends</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Group Name */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Apartment 4B"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              {/* Add Members */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Add Members
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                    placeholder="Enter name or email"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <NeonButton variant="secondary" onClick={handleAddMember}>
                    <Plus className="w-5 h-5" />
                  </NeonButton>
                </div>
              </div>

              {/* Members List */}
              {members.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {members.map((member) => (
                    <motion.div
                      key={member}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/10 rounded-full"
                    >
                      <span className="text-white text-sm">{member}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveMember(member)}
                        className="text-white/40 hover:text-pink-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Suggested Members */}
              <div>
                <label className="block text-white/50 text-xs mb-3">
                  <Users className="w-4 h-4 inline mr-1" />
                  Suggested Friends
                </label>
                <div className="flex flex-wrap gap-2">
                  {suggestedMembers.map((member) => (
                    <motion.button
                      key={member.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddSuggested(member.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                    >
                      <span>{member.avatar}</span>
                      <span className="text-white/70 text-sm">{member.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-white/10">
              <NeonButton variant="secondary" fullWidth onClick={onClose}>
                Cancel
              </NeonButton>
              <NeonButton
                variant="primary"
                glowColor="emerald"
                fullWidth
                onClick={handleSubmit}
                disabled={!name.trim() || members.length === 0}
              >
                Create Group
              </NeonButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}