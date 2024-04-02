function validarDatos(req, res, next) {
  const { title, description, price } = req.body;
  if (!title || !description || !price) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  next();
}

app.post("/api/products", validarDatos, (req, res) => {});
