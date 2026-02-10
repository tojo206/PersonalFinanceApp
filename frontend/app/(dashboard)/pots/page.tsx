// ============================================
// POTS PAGE
// ============================================

'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout'
import { PotCard } from '@/components/pots'
import { Button } from '@/components/common'
import { Loading } from '@/components/common'
import { formatCurrency } from '@/lib/utils'
import { potsApi, ApiError } from '@/lib/api'

export default function PotsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [pots, setPots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPots()
  }, [])

  async function fetchPots() {
    try {
      setLoading(true)
      setError(null)
      const data = await potsApi.list()
      setPots(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to load pots')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddMoney = (id: string) => {
    // TODO: Implement add money modal
    console.log('Add money to pot:', id)
  }

  const handleWithdraw = (id: string) => {
    // TODO: Implement withdraw modal
    console.log('Withdraw from pot:', id)
  }

  const handleEdit = (id: string) => {
    // TODO: Implement edit functionality
    console.log('Edit pot:', id)
  }

  const handleDelete = async (id: string) => {
    try {
      await potsApi.delete(id)
      fetchPots()
    } catch (err) {
      console.error('Failed to delete pot:', err)
    }
  }

  const totalSaved = pots.reduce((sum, pot) => sum + Number(pot.total), 0)

  return (
    <DashboardLayout title="Pots">
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-secondary text-small">
              You have {formatCurrency(totalSaved)} saved across {pots.length} pot{pots.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>+ Add New Pot</Button>
        </div>

        {/* Content */}
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-secondary mb-4">{error}</p>
            <button
              onClick={fetchPots}
              className="text-primary hover:text-primary-dark transition"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {/* Pots Grid */}
            {pots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pots.map((pot) => (
                  <PotCard
                    key={pot.id}
                    {...pot}
                    onAddMoney={handleAddMoney}
                    onWithdraw={handleWithdraw}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="card text-center py-12">
                <p className="text-secondary mb-4">No pots yet. Create your first savings pot!</p>
                <Button onClick={() => setIsAddModalOpen(true)}>Add New Pot</Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* TODO: Add Pot Modal */}
      {/* {isAddModalOpen && (
        <AddPotModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )} */}
    </DashboardLayout>
  )
}
