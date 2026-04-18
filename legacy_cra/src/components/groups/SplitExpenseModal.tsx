import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Receipt, Users, Split } from 'lucide-react';
import { NeonButton } from '../ui/NeonButton';

interface SplitExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId?: string | null;
}

const splitOptions = [
  { id: 'equal', label: 'Split Equally', icon: <Split className="w-5 h-5" /> },
  { id: 'custom', label: 'Custom Amount', icon: <DollarSign className="w-5 h-5" /> },
  { id: 'percentage', label: 'By Percentage', icon: <Receipt className="w-5 h-5" /> },
];

const mockMembers = [
  { id: '1', name: 'You', avatar: '👤' },
  { id: '2', name: 'Sarah', avatar: '👩' },
  { id: '3', name: 'Mike', avatar: '👨' },
  { id: '4', name: 'Emma', avatar: '👩‍🦰' },
];

export function SplitExpenseModal({ isOpen, onClose, groupId }: SplitExpenseModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [splits, setSplits] = useState<Record<string, number>>({});

  const handleAmountChange = (value: string) => {
    const numeric = value.replace(/[^0-9.]/g, '');
    setAmount(numeric);
  };

  const handleSubmit = () => {
    // Handle expense creation
    console.log({ description, amount, splitType, splits, groupId });
    onClose();
  };

  const total = parseFloat(amount) || 0;
  const perPerson = total > 0 ? (total / mockMembers.length).toFixed(2) : '0.00';

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
            className="w-full max-w-md bg-[#111118] border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">Add Expense</h2>
                <p className="text-white/50 text-sm mt-1">Split with your group</p>
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
              {/* Amount */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-3xl font-bold text-white placeholder:text-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Dinner at Mario's"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              {/* Split Type */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-3">
                  Split Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {splitOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSplitType(option.id)}
                      className={`
                        flex flex-col items-center gap-2 p-3 rounded-xl transition-all
                        ${splitType === option.id
                          ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-400'
                          : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                        }
                      `}
                    >
                      {option.icon}
                      <span className="text-xs font-medium">{option.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Members Split */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-3">
                  <Users className="w-4 h-4 inline mr-1" />
                  Split Between ({mockMembers.length})
                </label>
                <div className="space-y-2">
                  {mockMembers.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{member.avatar}</span>
                        <span className="text-white font-medium">{member.name}</span>
                      </div>
                      <div className="text-right">
                        {splitType === 'equal' ? (
                          <span className="text-indigo-400 font-semibold">${perPerson}</span>
                        ) : (
                          <input
                            type="number"
                            placeholder="0.00"
                            className="w-24 px-2 py-1 bg-white/10 border border-white/10 rounded-lg text-white text-right focus:border-indigo-500 focus:outline-none"
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {total > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Total Split</span>
                    <span className="text-2xl font-bold text-white">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-white/50 text-sm">Per Person</span>
                    <span className="text-indigo-400 font-semibold">${perPerson}</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <NeonButton
                variant="primary"
                glowColor="emerald"
                fullWidth
                onClick={handleSubmit}
                disabled={!amount || !description.trim()}
              >
                Add Expense
              </NeonButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}