/**
 * Google Sheets integration via Google Apps Script Web App
 *
 * HOW TO SET UP:
 * 1. Open your Google Sheet
 * 2. Extensions → Apps Script
 * 3. Paste the Apps Script code from the README / setup guide
 * 4. Deploy as Web App → set "Who has access" to "Anyone"
 * 5. Copy the Web App URL and set it as VITE_GOOGLE_SHEETS_URL in your
 *    Vercel environment variables (and in a local .env file for dev)
 */

import type { Step1Data }  from '../pages/AddInstallation/Step1FacilityType'
import type { Inverter }   from '../pages/AddInstallation/Step2AddInverter'
import type { SolarPanel } from '../pages/AddInstallation/Step3AddSolarPanels'
import type { Battery }    from '../pages/AddInstallation/Step4AddBatteries'
import type { Accessory }  from '../pages/AddInstallation/Step5AddAccessories'

export interface SubmissionPayload {
  installationId: string
  step1Data:      Step1Data
  inverters:      Inverter[]
  panels:         SolarPanel[]
  batteries:      Battery[]
  accessories:    Accessory[]
}

/**
 * Flatten one installation submission into rows suitable for Google Sheets.
 * Each piece of equipment becomes its own row so the sheet stays tabular.
 */
function buildRows(payload: SubmissionPayload): Record<string, string>[] {
  const { installationId, step1Data, inverters, panels, batteries, accessories } = payload
  const dateSubmitted = new Date().toLocaleDateString('en-GB')
  const base = {
    installationId,
    facility:    step1Data.facility,
    systemTypes: step1Data.systemTypes.join(', '),
    dateSubmitted,
  }

  const rows: Record<string, string>[] = []

  inverters.forEach((inv, i) => {
    rows.push({
      ...base,
      equipmentType:        'Inverter',
      equipmentIndex:       String(i + 1),
      systemType:           inv.systemType,
      make:                 inv.make,
      model:                inv.model,
      serialNumber:         inv.serialNumber,
      quantity:             inv.quantity,
      equipmentStatus:      inv.equipmentStatus,
      ratedPower:           inv.ratedPower,
      voltage:              inv.voltage,
      capacity:             inv.capacity,
      integratedBattery:    inv.integratedBattery,
      batteryCapacity:      inv.batteryCapacity,
      warrantyStart:        inv.warrantyStart,
      warrantyEnd:          inv.warrantyEnd,
      maintenanceFrequency: inv.maintenanceFrequency,
      nextMaintenance:      inv.nextMaintenance ?? '',
      lastMaintenance:      inv.lastMaintenance,
      installationDate:     inv.installationDate,
      generalNotes:         inv.generalNotes,
    })
  })

  panels.forEach((p, i) => {
    rows.push({
      ...base,
      equipmentType:        'Solar Panel',
      equipmentIndex:       String(i + 1),
      systemType:           p.systemType,
      linkedInverter:       p.linkedInverter,
      make:                 p.make,
      model:                p.model,
      serialNumber:         p.serialNumber,
      quantity:             p.quantity,
      equipmentStatus:      p.equipmentStatus,
      ratedPower:           p.ratedPower,
      warrantyStart:        p.warrantyStart,
      warrantyEnd:          p.warrantyEnd,
      maintenanceFrequency: p.maintenanceFrequency,
      lastMaintenance:      p.lastMaintenance,
      installationDate:     p.installationDate,
      generalNotes:         p.generalNotes,
    })
  })

  batteries.forEach((b, i) => {
    rows.push({
      ...base,
      equipmentType:        'Battery',
      equipmentIndex:       String(i + 1),
      systemType:           b.systemType,
      linkedInverter:       b.linkedInverter,
      make:                 b.make,
      model:                b.model,
      serialNumber:         b.serialNumber,
      quantity:             b.quantity,
      equipmentStatus:      b.equipmentStatus,
      batteryType:          b.batteryType,
      capacity:             b.capacity,
      voltage:              b.voltage,
      warrantyStart:        b.warrantyStart,
      warrantyEnd:          b.warrantyEnd,
      maintenanceFrequency: b.maintenanceFrequency,
      lastMaintenance:      b.lastMaintenance,
      installationDate:     b.installationDate,
      generalNotes:         b.generalNotes,
    })
  })

  accessories.forEach((a, i) => {
    rows.push({
      ...base,
      equipmentType:        'Accessory',
      equipmentIndex:       String(i + 1),
      systemType:           a.systemType,
      linkedInverter:       a.linkedInverter,
      make:                 a.make,
      model:                a.model,
      serialNumber:         a.serialNumber,
      quantity:             a.quantity,
      equipmentStatus:      a.equipmentStatus,
      accessoryType:        a.accessoryType,
      controllerType:       a.controllerType ?? '',
      nextMaintenance:      a.nextMaintenance ?? '',
      warrantyStart:        a.warrantyStart,
      warrantyEnd:          a.warrantyEnd,
      maintenanceFrequency: a.maintenanceFrequency,
      lastMaintenance:      a.lastMaintenance,
      installationDate:     a.installationDate,
      generalNotes:         a.generalNotes,
    })
  })

  return rows
}

export async function submitToGoogleSheets(payload: SubmissionPayload): Promise<void> {
  const url = import.meta.env.VITE_GOOGLE_SHEETS_URL as string | undefined
  if (!url) {
    console.warn('VITE_GOOGLE_SHEETS_URL is not set — skipping Google Sheets submission')
    return
  }

  const rows = buildRows(payload)

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ rows }),
  })

  if (!response.ok) {
    throw new Error(`Google Sheets submission failed: ${response.status}`)
  }
}
