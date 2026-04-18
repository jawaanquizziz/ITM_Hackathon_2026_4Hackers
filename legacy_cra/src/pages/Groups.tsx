import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, GlassCardContent } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import { GlowText } from '../components/ui/GlowText';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { GroupCard } from '../components/groups/GroupCard';
import { CreateGroupModal } from '../components/groups/CreateGroupModal';
import { SplitExpenseModal } from '../components/groups/SplitExpenseModal';
import { Plus, Users, Search, Filter } from 'lucide-react';

const mockGroups = [
  {
    id: '1',
    name: 'Apartment 4B',
    members: 4,
    balance: 45.5,
    type: 'owed' as const,
    lastActivity: '2h ago',
    avatar: '🏠',
  },
  {
    id: '2',
    name: 'Road Trip Crew',
    members: 6,
    balance: -23.75,
    type: 'owe' as const,
    lastActivity: '1d ago',
    avatar: '🚗',
  },
  {
    id: '3',
    name: 'Friday Dinners',
    members: 8,
    balance: 156.2,
    type: 'owed' as const,
    lastActivity: '3h ago',
    avatar: '🍽️',
  },
  {
    id: '4',
    name: 'Concert Squad',
    members: 5,
    balance: 0,
    type: 'settled' as const,
    lastActivity: '1w ago',
    avatar: '🎵',
  },
  {
    id: '5',
    name: 'Beach Trip',
    members: 12,
    balance: 89.0,
    type: 'owed' as const,
    lastActivity: '5d ago',
    avatar: '🏖️',
  },
];

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Owed to me', value: 'owed' },
  { label: 'I owe', value: 'owe' },
  { label: 'Settled', value: 'settled' },
];

export function Groups() {
  const [groups] = useState(mockGroups);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || group.type === filter;
    return matchesSearch && matchesFilter;
  });

  const totalOwed = groups
    .filter((g) => g.type === 'owed')
    .reduce((acc, g) => acc + g.balance, 0);

  const totalOwe = groups
    .filter((g) => g.type === 'owe')
    .reduce((acc, g) => acc + Math.abs(g.balance), 0);

  return (
    <AnimatedBackground variant="mesh" intensity="medium">
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <GlowText variant="gradient" color="multi" size="3xl" weight="bold">
                My Groups
              </GlowText>
              <p className="text-white/60 mt-1">Manage your shared expenses</p>
            </div>
            <NeonButton
              variant="primary"
              leftIcon={<Plus className="w-5 h-5" />}
              onClick={() => setShowCreateModal(true)}
            >
              Create Group
            </NeonButton>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard variant="glow" glowColor="emerald" className="text-center p-6">
                <p className="text-white/50 text-sm">You're Owed</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">
                  ${totalOwed.toFixed(2)}
                </p>
                <p className="text-white/40 text-xs mt-1">From {groups.filter((g) => g.type === 'owed').length} groups</p>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard variant="glow" glowColor="pink" className="text-center p-6">
                <p className="text-white/50 text-sm">You Owe</p>
                <p className="text-3xl font-bold text-pink-400 mt-1">
                  ${totalOwe.toFixed(2)}
                </p>
                <p className="text-white/40 text-xs mt-1">To {groups.filter((g) => g.type === 'owe').length} groups</p>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="text-center p-6">
                <p className="text-white/50 text-sm">Net Balance</p>
                <p className="text-3xl font-bold text-white mt-1">
                  ${(totalOwed - totalOwe).toFixed(2)}
                </p>
                <p className="text-white/40 text-xs mt-1">Overall position</p>
              </GlassCard>
            </motion.div>
          </div>

          {/* Search & Filter */}
          <GlassCard>
            <GlassCardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search groups..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                {/* Filter */}
                <div className="flex gap-2">
                  {filterOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFilter(option.value)}
                      className={`
                        px-4 py-3 rounded-xl font-medium transition-all
                        ${filter === option.value
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                        }
                      `}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* Groups Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {/* @ts-ignore */}
      <AnimatePresence>
              {filteredGroups.map((group, index) => (
                <motion.div
                  key={group.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GroupCard
                    {...group}
                    onAddExpense={() => {
                      setSelectedGroup(group.id);
                      setShowSplitModal(true);
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredGroups.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <Users className="w-10 h-10 text-white/30" />
              </div>
              <p className="text-white/50 text-lg">No groups found</p>
              <p className="text-white/30 mt-1">Create a group to start splitting expenses</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      <SplitExpenseModal
        isOpen={showSplitModal}
        onClose={() => {
          setShowSplitModal(false);
          setSelectedGroup(null);
        }}
        groupId={selectedGroup}
      />
    </AnimatedBackground>
  );
}