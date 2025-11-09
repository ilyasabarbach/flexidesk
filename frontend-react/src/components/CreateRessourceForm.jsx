import React, { useState } from "react";
import ressourceService from "../services/ressourceService";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

const CreateRessourceForm = ({ onRessourceCreated }) => {
  const [nom, setNom] = useState("");
  const [type, setType] = useState("BUREAU");
  const [capacite, setCapacite] = useState(1);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await ressourceService.createRessource(nom, type, capacite);
      alert("Ressource créée !");
      onRessourceCreated();
      setNom("");
      setType("BUREAU");
      setCapacite(1);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création. Avez-vous les droits (Admin) ?");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ my: 2, p: 3, border: "2px solid green", borderRadius: 2 }}
    >
      <Typography variant="h5" gutterBottom>
        Panneau Admin
      </Typography>
      <Typography variant="h6" gutterBottom>
        Créer une Ressource
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Nom de la ressource"
        fullWidth
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="type-select-label">Type</InputLabel>
        <Select
          labelId="type-select-label"
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="BUREAU">Bureau</MenuItem>
          <MenuItem value="SALLE_REUNION">Salle de réunion</MenuItem>
          <MenuItem value="PARKING">Parking</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Capacité"
        type="number"
        fullWidth
        value={capacite}
        onChange={(e) => setCapacite(parseInt(e.target.value))}
        required
        InputProps={{ inputProps: { min: 1 } }}
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" color="success">
        Créer
      </Button>
    </Box>
  );
};

export default CreateRessourceForm;
