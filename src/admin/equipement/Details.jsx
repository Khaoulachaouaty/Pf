import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { adminService } from "../../services/equipement_service";

const Details = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const eqptCode = searchParams.get("eqptCode");
  const [eqpm, setEqpm] = useState(null);

  useEffect(() => {
    if (eqptCode) {
      loadEqpm(eqptCode);
    }
  }, [eqptCode]);

  const loadEqpm = async (eqptCode) => {
    try {
      const response = await adminService.getEquipement(eqptCode)
      setEqpm(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box maxWidth="700px" margin="auto" mt={2}>
      <Box textAlign="center" mb={2}>
        <Header title="Détails" subTitle="Détail d'équipement" />
      </Box>
      {eqpm && (
        <TableContainer component={Paper}>
          <Table aria-label="Details de l'équipement">
            <TableHead>
              <TableRow>
                <TableCell>Propriété</TableCell>
                <TableCell>Valeur</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>{eqpm.eqptCode}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Désignation</TableCell>
                <TableCell>{eqpm.eqptDesignation}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Equipement type</TableCell>
                <TableCell>{eqpm.type.eqtyLibelle}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Equipement famille</TableCell>
                <TableCell>{eqpm.famille.eqfaLibelle}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Identifiant</TableCell>
                <TableCell>{eqpm.eqptId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Garantie</TableCell>
                <TableCell>
                  {eqpm.eqptGarantie === "O" ? "Oui" : "Non"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Critique</TableCell>
                <TableCell>
                  {eqpm.eqptCritique === "O" ? "Oui" : "Non"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>En service</TableCell>
                <TableCell>
                  {eqpm.eqptEnService === "O" ? "Oui" : "Non"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Localisation</TableCell>
                <TableCell>{eqpm.eqptLocalisation}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type garantie</TableCell>
                <TableCell>{eqpm.eqptGarTypeDtRef}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Machine</TableCell>
                <TableCell>
                  {eqpm.eqptMachine === "O" ? "Oui" : "Non"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date d'achat</TableCell>
                <TableCell>
                  {eqpm.eqptDtAchat
                    ? dayjs(eqpm.eqptDtAchat).format("DD/MM/YYYY")
                    : ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Prix</TableCell>
                <TableCell>{eqpm.eqptPrix}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Numero de lot</TableCell>
                <TableCell>{eqpm.eqptLotNumero}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Numero de serie</TableCell>
                <TableCell>{eqpm.eqptNumeroSerie}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date de fabrication</TableCell>
                <TableCell>
                  {eqpm.dateFabrication
                    ? dayjs(eqpm.dateFabrication).format("DD/MM/YYYY")
                    : ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date de livraison</TableCell>
                <TableCell>
                  {eqpm.dateLivraison
                    ? dayjs(eqpm.dateLivraison).format("DD/MM/YYYY")
                    : ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date de mise en service</TableCell>
                <TableCell>
                  {eqpm.dateMiseEnService
                    ? dayjs(eqpm.dateMiseEnService).format("DD/MM/YYYY")
                    : ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date d'Installation</TableCell>
                <TableCell>
                  {eqpm.dateInstallation
                    ? dayjs(eqpm.dateInstallation).format("DD/MM/YYYY")
                    : ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date de démonstration</TableCell>
                <TableCell>
                  {eqpm.dateDemontage
                    ? dayjs(eqpm.dateDemontage).format("DD/MM/YYYY")
                    : ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date de remplacement</TableCell>
                <TableCell>
                  {eqpm.dateRemplacement
                    ? dayjs(eqpm.dateRemplacement).format("DD/MM/YYYY")
                    : ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Durée de garantie</TableCell>
                <TableCell>{eqpm.eqptDureeGarantie}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date de fin de garantie</TableCell>
                <TableCell>
                  {eqpm.dateFinGarantie
                    ? dayjs(eqpm.dateFinGarantie).format("DD/MM/YYYY")
                    : ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Article</TableCell>
                <TableCell>{eqpm.articleCode}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Post</TableCell>
                <TableCell>{eqpm.postCode}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ress</TableCell>
                <TableCell>{eqpm.ressCode}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Centre</TableCell>
                <TableCell>{eqpm.centreCode}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Site</TableCell>
                <TableCell>{eqpm.siteCode}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Details;
