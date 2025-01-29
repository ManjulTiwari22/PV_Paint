import  { useState, useEffect } from "react"
import { Card } from "./components/ui/card"
import { Label } from "./components/ui/label"
import { Input } from "./components/ui/input"
import {
  Select,

} from "./components/ui/select"
import { Checkbox } from "./components/ui/checkbox"

const paintTypes = {
  primer: [
    { name: "Epoxy Zinc-Rich Primer", defaultDft: 62.5, volumeSolids: 57.5, coverage: 15.75 },
    { name: "Inorganic Zinc Silicate Primer", defaultDft: 62.5, volumeSolids: 62.5, coverage: 14.5 },
    { name: "Alkyd Primer", defaultDft: 40, volumeSolids: 47.5, coverage: 10.65 },
    { name: "Polyurethane Primer", defaultDft: 50, volumeSolids: 45, coverage: 10.4 },
  ],
  intermediate: [
    { name: "Epoxy MIO (Micaceous Iron Oxide)", defaultDft: 125, volumeSolids: 70, coverage: 8.35 },
    { name: "High Build Epoxy Coating", defaultDft: 162.5, volumeSolids: 60, coverage: 6.5 },
    { name: "Coal Tar Epoxy", defaultDft: 225, volumeSolids: 67.5, coverage: 5 },
    { name: "Phenolic Epoxy", defaultDft: 175, volumeSolids: 65, coverage: 5.85 },
    { name: "Glass Flake Reinforced Epoxy", defaultDft: 400, volumeSolids: 70, coverage: 1.75 },
  ],
  topcoat: [
    { name: "Polyurethane Topcoat", defaultDft: 57.5, volumeSolids: 55, coverage: 11.65 },
    { name: "Acrylic Topcoat", defaultDft: 40, volumeSolids: 45, coverage: 10.65 },
    { name: "Chlorinated Rubber Coating", defaultDft: 62.5, volumeSolids: 45, coverage: 10.25 },
    { name: "Fluoropolymer Coatings", defaultDft: 37.5, volumeSolids: 35, coverage: 9.65 },
    { name: "Silicone Coatings", defaultDft: 37.5, volumeSolids: 35, coverage: 9.65 },
    { name: "Vinyl Coatings", defaultDft: 62.5, volumeSolids: 40, coverage: 9.6 },
    { name: "Polyaspartic Coating", defaultDft: 100, volumeSolids: 70, coverage: 7.5 },
    { name: "Silicone-Alkyd Topcoat", defaultDft: 40, volumeSolids: 45, coverage: 10.65 },
  ],
  specialPurpose: [
    { name: "Bituminous Coating", defaultDft: 200, volumeSolids: 55, coverage: 3.25 },
    { name: "Intumescent Fireproofing Coating", defaultDft: 650, volumeSolids: 67.5, coverage: 1.65 },
    { name: "Thermal Insulating Coating", defaultDft: 1250, volumeSolids: 55, coverage: 1.25 },
  ],
}

export default function App() {
  const [dimensions, setDimensions] = useState({ length: 0, diameter: 0, thickness: 0 })
  const [paints, setPaints] = useState({
    primer: { type: "", dft: 0, volumeSolids: 0, coverage: 0 },
    intermediate: { type: "", dft: 0, volumeSolids: 0, coverage: 0 },
    topcoat: { type: "", dft: 0, volumeSolids: 0, coverage: 0 },
    specialPurpose: { type: "", dft: 0, volumeSolids: 0, coverage: 0 },
  })
  const [result, setResult] = useState(null)
  const [includeInternal, setIncludeInternal] = useState(false)
  const [useSpecialPurpose, setUseSpecialPurpose] = useState(false)

  const handleDimensionChange = (e) => {
    setDimensions({ ...dimensions, [e.target.name]: Number.parseFloat(e.target.value) || 0 })
  }

  const handlePaintChange = (coat, field, value) => {
    if (field === "type") {
      const selectedPaint = paintTypes[coat].find((p) => p.name === value)
      setPaints({
        ...paints,
        [coat]: {
          type: value,
          dft: selectedPaint ? selectedPaint.defaultDft : 0,
          volumeSolids: selectedPaint ? selectedPaint.volumeSolids : 0,
          coverage: selectedPaint ? selectedPaint.coverage : 0,
        },
      })
    } else {
      setPaints({
        ...paints,
        [coat]: { ...paints[coat], [field]: Number.parseFloat(value) || 0 },
      })
    }
  }

  const calculatePaintQuantity = () => {
    const { length, diameter, thickness } = dimensions
    const radius = diameter / 2000 // Convert mm to meters
    const internalRadius = radius - thickness / 1000 // Convert thickness to meters
    const lengthInMeters = length / 1000 // Convert mm to meters

    // Calculate surface areas
    const externalArea = 2 * Math.PI * radius * (radius + lengthInMeters)
    const internalArea = includeInternal ? 2 * Math.PI * internalRadius * (internalRadius + lengthInMeters) : 0

    // Calculate paint volumes
    const calculatePaintVolume = (area, dft, volumeSolids) => (area * dft) / (10 * volumeSolids)

    const coats = useSpecialPurpose
      ? ["primer", "intermediate", "topcoat", "specialPurpose"]
      : ["primer", "intermediate", "topcoat"]

    const externalVolumes = coats.reduce((acc, coat) => {
      acc[coat] = calculatePaintVolume(externalArea, paints[coat].dft, paints[coat].volumeSolids)
      return acc
    }, {})

    const internalVolumes = includeInternal
      ? coats.reduce((acc, coat) => {
          acc[coat] = calculatePaintVolume(internalArea, paints[coat].dft, paints[coat].volumeSolids)
          return acc
        }, {})
      : {}

    const totalExternalVolume = Object.values(externalVolumes).reduce((sum, volume) => sum + volume, 0)
    const totalInternalVolume = includeInternal
      ? Object.values(internalVolumes).reduce((sum, volume) => sum + volume, 0)
      : 0
    const totalVolume = totalExternalVolume + totalInternalVolume

    setResult({
      externalArea,
      internalArea,
      externalVolumes,
      internalVolumes,
      totalExternalVolume,
      totalInternalVolume,
      totalVolume,
    })
  }

  useEffect(() => {
    calculatePaintQuantity()
  }, [dimensions, paints, includeInternal, useSpecialPurpose])

  return (
    <div className="container">
      <Card className="calculator-card">
        <h2 className="calculator-title">Pressure Vessel Paint Calculator</h2>
        <div className="input-grid">
          <div>
            <Label htmlFor="length">Vessel Length (mm)</Label>
            <Input
              id="length"
              name="length"
              type="number"
              value={dimensions.length || ""}
              onChange={handleDimensionChange}
              placeholder="Enter length in mm"
            />
          </div>
          <div>
            <Label htmlFor="diameter">Vessel Diameter (mm)</Label>
            <Input
              id="diameter"
              name="diameter"
              type="number"
              value={dimensions.diameter || ""}
              onChange={handleDimensionChange}
              placeholder="Enter diameter in mm"
            />
          </div>
          <div>
            <Label htmlFor="thickness">Vessel Thickness (mm)</Label>
            <Input
              id="thickness"
              name="thickness"
              type="number"
              value={dimensions.thickness || ""}
              onChange={handleDimensionChange}
              placeholder="Enter thickness in mm"
            />
          </div>
        </div>

        <div className="input-grid">
          {["primer", "intermediate", "topcoat"].map((coat) => (
            <div key={coat}>
              <Label htmlFor={`${coat}-type`}>{coat.charAt(0).toUpperCase() + coat.slice(1)} Type</Label>
              <Select
                id={`${coat}-type`}
                value={paints[coat].type}
                onChange={(value) => handlePaintChange(coat, "type", value)}
                options={paintTypes[coat].map((paint) => ({ value: paint.name, label: paint.name }))}
                placeholder={`Select ${coat} type`}
              />
              <Label htmlFor={`${coat}-dft`}>{coat.charAt(0).toUpperCase() + coat.slice(1)} DFT (µm)</Label>
              <Input
                id={`${coat}-dft`}
                type="number"
                value={paints[coat].dft || ""}
                onChange={(e) => handlePaintChange(coat, "dft", e.target.value)}
                placeholder={`Enter ${coat} DFT`}
              />
            </div>
          ))}
        </div>

        <div className="checkbox-container">
          <Checkbox
            id="includeInternal"
            checked={includeInternal}
            onChange={(checked) => setIncludeInternal(checked)}
          />
          <Label htmlFor="includeInternal">Include Internal Surface Area Calculation</Label>
        </div>

        <div className="checkbox-container">
          <Checkbox
            id="useSpecialPurpose"
            checked={useSpecialPurpose}
            onChange={(checked) => setUseSpecialPurpose(checked)}
          />
          <Label htmlFor="useSpecialPurpose">Use Special Purpose Coating</Label>
        </div>

        {useSpecialPurpose && (
          <div className="input-grid">
            <div>
              <Label htmlFor="specialPurpose-type">Special Purpose Coating Type</Label>
              <Select
                id="specialPurpose-type"
                value={paints.specialPurpose.type}
                onChange={(value) => handlePaintChange("specialPurpose", "type", value)}
                options={paintTypes.specialPurpose.map((paint) => ({ value: paint.name, label: paint.name }))}
                placeholder="Select special purpose coating type"
              />
              <Label htmlFor="specialPurpose-dft">Special Purpose Coating DFT (µm)</Label>
              <Input
                id="specialPurpose-dft"
                type="number"
                value={paints.specialPurpose.dft || ""}
                onChange={(e) => handlePaintChange("specialPurpose", "dft", e.target.value)}
                placeholder="Enter special purpose coating DFT"
              />
            </div>
          </div>
        )}

        {result && (
          <div className="results">
            <h3>Results:</h3>
            <p>External Surface Area: {result.externalArea.toFixed(2)} m²</p>
            {includeInternal && <p>Internal Surface Area: {result.internalArea.toFixed(2)} m²</p>}

            <h4>External Paint :</h4>
            {Object.entries(result.externalVolumes).map(([coat, volume]) => (
              <p key={coat}>
                {coat.charAt(0).toUpperCase() + coat.slice(1)} Paint: {volume.toFixed(2)} liters
              </p>
            ))}
            <p>Total External Paint : {result.totalExternalVolume.toFixed(2)} liters</p>

            {includeInternal && (
              <>
                <h4>Internal Paint:</h4>
                {Object.entries(result.internalVolumes).map(([coat, volume]) => (
                  <p key={coat}>
                    {coat.charAt(0).toUpperCase() + coat.slice(1)} Paint : {volume.toFixed(2)} liters
                  </p>
                ))}
                <p>Total Internal Paint: {result.totalInternalVolume.toFixed(2)} liters</p>
              </>
            )}

            <p>Total Paint: {result.totalVolume.toFixed(2)} liters</p>
          </div>
        )}
      </Card>
    </div>
  )
}

