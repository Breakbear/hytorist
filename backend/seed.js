const db = require('./database')

const sampleInquiries = [
  {
    name: 'Alice Zhang',
    email: 'alice@example.com',
    phone: '+86 10 1000 0001',
    company: 'Northwind Energy',
    product: 'Hydraulic Torque Wrench',
    quantity: '2',
    message: 'Need torque tools for turbine maintenance.',
    status: 'pending'
  },
  {
    name: 'Bob Li',
    email: 'bob@example.com',
    phone: '+86 10 1000 0002',
    company: 'Delta Plant Services',
    product: 'Electric Hydraulic Pump',
    quantity: '1',
    message: 'Please share lead time and warranty.',
    status: 'reviewed'
  },
  {
    name: 'Cindy Wang',
    email: 'cindy@example.com',
    phone: '+86 10 1000 0003',
    company: 'Skyline Petrochem',
    product: 'Socket Set',
    quantity: '6',
    message: 'Looking for matching sockets and accessories.',
    status: 'contacted'
  },
  {
    name: 'David Sun',
    email: 'david@example.com',
    phone: '+86 10 1000 0004',
    company: 'Harbor Shipyard',
    product: 'Air Hydraulic Pump',
    quantity: '3',
    message: 'Urgent requirement for maintenance shutdown.',
    status: 'completed'
  },
  {
    name: 'Emma Xu',
    email: 'emma@example.com',
    phone: '+86 10 1000 0005',
    company: 'Metro Construction',
    product: 'Reaction Arm',
    quantity: '4',
    message: 'Need custom reaction arm options.',
    status: 'rejected'
  }
]

const insertSql =
  'INSERT INTO inquiries (name, email, phone, company, product, quantity, message, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'

db.serialize(() => {
  db.run('DELETE FROM inquiries', (deleteErr) => {
    if (deleteErr) {
      console.error('Failed to clear existing inquiries:', deleteErr.message)
      db.close()
      process.exitCode = 1
      return
    }

    const stmt = db.prepare(insertSql)

    sampleInquiries.forEach((item) => {
      stmt.run([
        item.name,
        item.email,
        item.phone,
        item.company,
        item.product,
        item.quantity,
        item.message,
        item.status
      ])
    })

    stmt.finalize((finalizeErr) => {
      if (finalizeErr) {
        console.error('Failed to insert sample inquiries:', finalizeErr.message)
        db.close()
        process.exitCode = 1
        return
      }

      console.log(`Seed complete: inserted ${sampleInquiries.length} inquiries.`)
      db.close()
    })
  })
})
