'use client'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Typography, Modal, TextField, Stack, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [itemToAdd, setItemToAdd] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'Inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'Inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }

    await updateInventory()
    setItemToAdd('')
    setShowAddDialog(false)
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'Inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    const lowercasedQuery = query.toLowerCase()
    const filtered = inventory.filter(item =>
      item.name.toLowerCase().includes(lowercasedQuery)
    )
    setFilteredInventory(filtered)

    if (filtered.length === 0 && query !== '') {
      setItemToAdd(query)
      setShowAddDialog(true)
    } else {
      setShowAddDialog(false)
    }
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Typography variant="h4">Add item</Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack direction="row" spacing={2} sx={{ mb: 2, width: '800px' }}>
        <TextField
          variant='outlined'
          placeholder="Search items"
          value={searchQuery}
          onChange={handleSearch}
          fullWidth
        />
        <Button variant="contained" onClick={handleOpen}>
          Add New Item
        </Button>
      </Stack>
      <Box border="1px solid #333" width="800px">
        <Box
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">Inventory Items</Typography>
        </Box>
        <Stack width="100%" height="300px" spacing={2} overflow="auto">
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              minHeight="85px"
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={2}
            >
              <Typography variant='h4' color="#333" textAlign="center">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
              <Typography variant='h4' color="#333" textAlign="center">{quantity}</Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => addItem(name)}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>

      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
        <DialogTitle>Item Not Found</DialogTitle>
        <DialogContent>
        <Typography>This is a &quot;quote&quot; inside a string</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => addItem(itemToAdd)}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
