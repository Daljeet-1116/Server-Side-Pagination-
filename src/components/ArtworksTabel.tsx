import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ArtworkService } from "../service/ArtworkService";

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

export default function ArtworksTable() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork[]>([]);
  const [inputValue, setInputValue] = useState("");
  const op = useRef<OverlayPanel>(null);

  const page = Math.floor(first / rows);

  const fetchArtworks = async (pageNumber: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await ArtworkService.getArtworks(
        pageNumber + 1,
        pageSize
      );
      setArtworks(response.artworks);
      setTotalRecords(response.totalRecords);
    } catch (err) {
      console.error("Error from fetch", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks(page, rows);
  }, [page, rows]);

  const handlePageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  // Dropdown button in header
  const idHeaderTemplate = () => {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span>ID</span>
        <Button
          icon="pi pi-chevron-down"
          style={{
            backgroundColor: "#f7f7f7",
            color: "black",
            width: "32px",
            height: "32px",
          }}
          onClick={(e) => op.current?.toggle(e)}
        />
      </div>
    );
  };

  // Select rows across pages based on input value
  const handleSubmit = async () => {
    const num = parseInt(inputValue);
    if (isNaN(num) || num <= 0) {
      setSelectedArtwork([]);
      op.current?.hide();
      return;
    }

    let selected: Artwork[] = [];
    let pageNumber = 0;

    while (selected.length < num && selected.length < totalRecords) {
      const response = await ArtworkService.getArtworks(pageNumber + 1, rows);
      selected = [...selected, ...response.artworks];
      pageNumber++;
    }

    setSelectedArtwork(selected.slice(0, num)); 
    op.current?.hide();
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        padding: "20px",
        background: "#f7f7f7",
        overflowX: "hidden",
      }}
    >
      <DataTable
        value={artworks}
        loading={loading}
        dataKey="id"
        selectionMode="multiple"
        selection={selectedArtwork}
        onSelectionChange={(e) => setSelectedArtwork(e.value)}
        responsiveLayout="scroll"
        tableStyle={{ minWidth: "60rem" }}
      >
        <Column selectionMode="multiple" style={{ width: "3rem" }} />
        <Column field="id" header={idHeaderTemplate} style={{ width: "10%" }} />
        <Column field="title" header="Title" style={{ width: "25%" }} />
        <Column
          field="place_of_origin"
          header="Place of Origin"
          style={{ width: "15%" }}
        />
        <Column
          field="artist_display"
          header="Artist"
          style={{ width: "20%" }}
        />
        <Column
          field="inscriptions"
          header="Inscriptions"
          style={{ width: "15%" }}
        />
        <Column
          field="date_start"
          header="Date Start"
          style={{ width: "10%" }}
        />
        <Column field="date_end!" header="Date End" style={{ width: "10%" }} />
      </DataTable>

      
      <OverlayPanel ref={op}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <InputText
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter number of rows..."
            style={{ width: "180px" }}
          />
          <Button
            label="Submit"
            onClick={handleSubmit}
            style={{
              width: "100%",
              padding: "4px 0",
              background: "#fff",
              color: "#000",
              border: "1px solid #ccc",
            }}
          />
        </div>
      </OverlayPanel>

      <div className="card">
        <Paginator
          first={first}
          rows={rows}
          totalRecords={120}
          rowsPerPageOptions={[10, 20, 30]}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
