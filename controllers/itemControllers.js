const {connection} = require('../config/database');


exports.getAllItems = (req,res) => {
    const query = "SELECT * FROM items";
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({error: err.message});
        } else {
            res.status(200).json(results);
        }
    });
};

exports.getDataItemsById = (req,res) => {
    const query = "SELECT * FROM items WHERE id = ?";
    const {id} = req.params;
    connection.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({error: err.message})
        } else if (results.length === 0 ) {
            res.status(404).json({message : 'Item Not Found'});
        } else {
            res.status(202).json(results[0]);
        }
    });
};


exports.createItems = (req, res) => {
    const { name, description, price } = req.body;
    const queryInsert = "INSERT INTO items (name, description, price) VALUES (?, ?, ?)";
    

    connection.query(queryInsert, [name, description, price], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            const newItemId = result.insertId; // Get the ID of the newly created record

            // Fetch the newly added record
            const querySelect = "SELECT * FROM items WHERE id = ?";
            connection.query(querySelect, [newItemId], (err, rows) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({
                        message: 'Data Item Berhasil dibuat',
                        data: rows[0], 
                    });
                }
            });
        }
    });
};

exports.updateItems = (req,res) => {
    const {name, description, price} = req.body;
    const {id} = req.params;
    const query = 'UPDATE items SET name = ?, description = ?, price = ? WHERE id = ?';
    connection.query(query, [name,description,price, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
          } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Item not found' });
          } else {
            res.status(200).json({ message: 'Data Item Berhasil Terupdate' });
          }
    });
};


exports.deleteItems = (req,res) => {
    const {id} = req.params;
    const query = 'DELETE FROM items WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message});
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Item not found' });
        } else {
            res.status(200).json({message: 'Data Item Berhasil Dihapus' });
        }
    });
}