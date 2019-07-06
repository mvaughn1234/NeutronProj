//
// ********************************************************************
// * License and Disclaimer                                           *
// *                                                                  *
// * The  Geant4 software  is  copyright of the Copyright Holders  of *
// * the Geant4 Collaboration.  It is provided  under  the terms  and *
// * conditions of the Geant4 Software License,  included in the file *
// * LICENSE and available at  http://cern.ch/geant4/license .  These *
// * include a list of copyright holders.                             *
// *                                                                  *
// * Neither the authors of this software system, nor their employing *
// * institutes,nor the agencies providing financial support for this *
// * work  make  any representation or  warranty, express or implied, *
// * regarding  this  software system or assume any liability for its *
// * use.  Please see the license in the file  LICENSE  and URL above *
// * for the full disclaimer and the limitation of liability.         *
// *                                                                  *
// * This  code  implementation is the result of  the  scientific and *
// * technical work of the GEANT4 collaboration.                      *
// * By using,  copying,  modifying or  distributing the software (or *
// * any work based  on the software)  you  agree  to acknowledge its *
// * use  in  resulting  scientific  publications,  and indicate your *
// * acceptance of all terms of the Geant4 Software license.          *
// ********************************************************************
//
/// \file DetectorConstruction.cc
/// \brief Implementation of the DetectorConstruction class
//
// $Id: DetectorConstruction.cc 70755 2013-06-05 12:17:48Z ihrivnac $
//

//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......
//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......

#include "DetectorConstruction.hh"
#include "DetectorMessenger.hh"
#include "G4Material.hh"
#include "G4NistManager.hh"

#include "G4Box.hh"
#include "G4Sphere.hh"
#include "G4LogicalVolume.hh"
#include "G4PVPlacement.hh"

#include "G4GeometryManager.hh"
#include "G4PhysicalVolumeStore.hh"
#include "G4SolidStore.hh"
#include "G4RunManager.hh"

#include "G4UnitsTable.hh"
#include "G4LogicalVolumeStore.hh"
#include "G4SystemOfUnits.hh"
#include "G4PhysicalConstants.hh"

//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......

DetectorConstruction::DetectorConstruction()
:G4VUserDetectorConstruction(),
 fMaterial1(0), fMaterial2(0), fMaterial3(0), fMaterial4(0), fLMat1(0), fLMat2(0), fLMat3(0), fLMat4(0), fWorldMat(0), fPWorld(0), fDetectorMessenger(0)
{
  fRadius1 = 30*cm*5/11;
  fRadius2 = 30*cm*1/11;
  fRadius3 = 30*cm*2/11;
  fRadius4 = 30*cm*3/11;
  fRadSum = fRadius1+fRadius2+fRadius3+fRadius4;
  //fSn = fRadius*5/11;
  //fBe = fRadius*1/11;
  //fC = fRadius*2/11;
  //fBHO = fRadius*3/11;

  fWorldSize = 1.1*fRadSum;
  DefineMaterials();
  //SetMaterial("Water_ts");
  SetMaterial1("tin");
  SetMaterial2("beryllium");
  SetMaterial3("graphite");
  SetMaterial4("BH3O3");
  fDetectorMessenger = new DetectorMessenger(this);
}

//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......

DetectorConstruction::~DetectorConstruction()
{ delete fDetectorMessenger;}

//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......

G4VPhysicalVolume* DetectorConstruction::Construct()
{
  return ConstructVolumes();
}

//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......

void DetectorConstruction::DefineMaterials()
{
  // specific element name for thermal neutronHP
  // (see G4ParticleHPThermalScatteringNames.cc)

  G4int ncomponents, natoms;

  //element repo
  G4Element* H  = new G4Element("TS_H_of_Water" ,"H" , 1., 1.0079*g/mole);
  G4Element* O  = new G4Element("Oxygen"        ,"O" , 8., 16.00*g/mole);
  G4Element* Mo = new G4Element("Molybdenum"    ,"Mo", 42., 97.905*g/mole);
  G4Element* Sn = new G4Element("Tin"           ,"Sn", 50., 118.71*g/mole);
  G4Element* B  = new G4Element("Boron"         ,"B" , 5., 10.8811*g/mole);
  G4Element* Be = new G4Element("Beryllium"     ,"Be", 4., 9.012182*g/mole);

  // pressurized water
  G4Material* H2O =
  new G4Material("Water_ts", 1.000*g/cm3, ncomponents=2,
                            kStateLiquid, 593*kelvin, 150*bar);
  H2O->AddElement(H, natoms=2);
  H2O->AddElement(O, natoms=1);
  H2O->GetIonisation()->SetMeanExcitationEnergy(78.0*eV);

  // heavy water
  G4Isotope* H2 = new G4Isotope("H2",1,2);
  G4Element* D  = new G4Element("TS_D_of_Heavy_Water", "D", 1);
  D->AddIsotope(H2, 100*perCent);
  G4Material* D2O = new G4Material("HeavyWater", 1.11*g/cm3, ncomponents=2,
                        kStateLiquid, 293.15*kelvin, 1*atmosphere);
  D2O->AddElement(D, natoms=2);
  D2O->AddElement(O, natoms=1);

  //Pure MO98
  G4Isotope* Mo98 = new G4Isotope("Mo98",42,98);
  G4Element* EnMo = new G4Element("Enriched_Moly98", "Mo98", 1);
  EnMo->AddIsotope(Mo98,100*perCent);
  G4Material* Moly = new G4Material("EnMoly", 10.28*g/cm3, ncomponents=1);
  Moly->AddElement(EnMo,natoms=1);


  // graphite
  G4Isotope* C12 = new G4Isotope("C12", 6, 12);
  G4Element* C   = new G4Element("TS_C_of_Graphite","C", ncomponents=1);
  C->AddIsotope(C12, 100.*perCent);
  G4Material* graphite =
  new G4Material("graphite", 2.27*g/cm3, ncomponents=1,
                         kStateSolid, 293*kelvin, 1*atmosphere);
  graphite->AddElement(C, natoms=1);

  //NE213
  G4Material* ne213 =
  new G4Material("NE213", 0.874*g/cm3, ncomponents=2);
  ne213->AddElement(H,  9.2*perCent);
  ne213->AddElement(C, 90.8*perCent);

  //G4Element* H  = new G4Element("TS_H_of_Water" ,"H" , 1., 1.0079*g/mole);
  //G4Element* O  = new G4Element("Oxygen"        ,"O" , 8., 16.00*g/mole);

  //G4Isotope* C12 = new G4Isotope("C12", 6, 12);

  //G4Element* C   = new G4Element("TS_C_of_Graphite","C", ncomponents=1);
  //C->AddIsotope(C12, 100.*perCent);

  //graphite
  //G4Material* graphite =
  //new G4Material("graphite", 2.27*g/cm3, ncomponents=1, kStateSolid, 293*kelvin, 1*atmosphere);
  //graphite->AddElement(C, natoms=1);

  //beryllium
  G4Material* beryllium=
  new G4Material("beryllium", 1.85*g/cm3, ncomponents=1);
  beryllium->AddElement(Be, natoms=1);

  //BH3O3
  G4Material* bh3o3 =
  new G4Material("BH3O3", 1.435*g/cm3, ncomponents=3);
  bh3o3->AddElement(B, natoms=1);
  bh3o3->AddElement(H, natoms=3);
  bh3o3->AddElement(O, natoms=3);

  //Tin
  G4Material* tin=
  new G4Material("tin", 7.31*g/cm3, ncomponents=1);
  tin->AddElement(Sn, natoms=1);

  //Molybdenum
  G4Material* moly=
  new G4Material("moly", 10.28*g/cm3, ncomponents=1);
  moly->AddElement(Mo, natoms=1);

  // example of vacuum
  fWorldMat = new G4Material("Galactic", 1, 1.01*g/mole, universe_mean_density,
                 kStateGas, 2.73*kelvin, 3.e-18*pascal);

 ///G4cout << *(G4Material::GetMaterialTable()) << G4endl;
}

//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......

G4Material* DetectorConstruction::MaterialWithSingleIsotope( G4String name,
                           G4String symbol, G4double density, G4int Z, G4int A)
{
 // define a material from an isotope
 //
 G4int ncomponents;
 G4double abundance, massfraction;

 G4Isotope* isotope = new G4Isotope(symbol, Z, A);

 G4Element* element  = new G4Element(name, symbol, ncomponents=1);
 element->AddIsotope(isotope, abundance= 100.*perCent);

 G4Material* material = new G4Material(name, density, ncomponents=1);
 material->AddElement(element, massfraction=100.*perCent);

 return material;
}

//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......

G4VPhysicalVolume* DetectorConstruction::ConstructVolumes()
{
  /*
  //Beryllium
  G4int ncomponents,natoms;
  //element repo
  G4Element* H  = new G4Element("TS_H_of_Water" ,"H" , 1., 1.0079*g/mole);
  G4Element* O  = new G4Element("Oxygen"        ,"O" , 8., 16.00*g/mole);
  G4Element* Sn = new G4Element("Tin"           ,"Sn", 50., 118.71*g/mole);
  G4Element* B  = new G4Element("Boron"         ,"B" , 5., 10.8811*g/mole);
  G4Element* Be = new G4Element("Beryllium"     ,"Be", 4., 9.012182*g/mole);
  G4Isotope* C12 = new G4Isotope("C12", 6, 12);

  G4Element* C   = new G4Element("TS_C_of_Graphite","C", ncomponents=1);
  C->AddIsotope(C12, 100.*perCent);

  //graphite
  G4Material* graphite =
  new G4Material("graphite", 2.27*g/cm3, ncomponents=1,
                         kStateSolid, 293*kelvin, 1*atmosphere);
  graphite->AddElement(C, natoms=1);

  //beryllium
  G4Material* beryllium=
  new G4Material("beryllium", 1.85*g/cm3, ncomponents=1);
  beryllium->AddElement(Be, natoms=1);

  //BH3O3
  G4Material* bh3o3 =
  new G4Material("BH3O3", 1.435*g/cm3, ncomponents=3);
  bh3o3->AddElement(B, natoms=1);
  bh3o3->AddElement(H, natoms=3);
  bh3o3->AddElement(O, natoms=3);

  //Tin
  G4Material* tin=
  new G4Material("tin", 7.31*g/cm3, ncomponents=1);
  tin->AddElement(Sn, natoms=1); */
  // Cleanup old geometry
  G4GeometryManager::GetInstance()->OpenGeometry();
  G4PhysicalVolumeStore::GetInstance()->Clean();
  G4LogicalVolumeStore::GetInstance()->Clean();
  G4SolidStore::GetInstance()->Clean();
  DetectorConstruction::DefineMaterials();




  // World
  //
  G4Box*
  sWorld = new G4Box("World",                           //name
                   fWorldSize,fWorldSize,fWorldSize);   //dimensions

  G4LogicalVolume*
  lWorld = new G4LogicalVolume(sWorld,                  //shape
                             fWorldMat,                 //material
                             "World");                  //name

  fPWorld = new G4PVPlacement(0,                        //no rotation
                            G4ThreeVector(),            //at (0,0,0)
                            lWorld,                     //logical volume
                            "World",                    //name
                            0,                          //mother volume
                            false,                      //no boolean operation
                            0);                         //copy number

  // Absorber
  //
  G4Sphere*
  sAbsor = new G4Sphere("Absorber",                     //name
                     0., fRadius1, 0., twopi, 0., pi);   //dimensions

  fLMat1 = new G4LogicalVolume(sAbsor,                  //shape
                             fMaterial1,                 //material
                             fMaterial1->GetName());     //name

           new G4PVPlacement(0,                         //no rotation
                           G4ThreeVector(),             //at (0,0,0)
                           fLMat1,                     //logical volume
                           fMaterial1->GetName(),        //name
                           lWorld,                      //mother  volume
                           false,                       //no boolean operation
                           0);                          //copy number


  //Be Ring
  //
  G4Sphere *
  sBeryl = new G4Sphere("BerylRing",
                    fRadius1, fRadius1+fRadius2, 0., twopi, 0., pi);

  fLMat2 = new G4LogicalVolume(sBeryl,
                            fMaterial2,
                            fMaterial2->GetName());

            new G4PVPlacement(0,                         //no rotation
                            G4ThreeVector(),             //at (0,0,0)
                            fLMat2,                     //logical volume
                            fMaterial2->GetName(),        //name
                            lWorld,                      //mother  volume
                            false,                       //no boolean operation
                            0);                          //copy number


  //Carbon (graphite) Ring
  //
  G4Sphere *
  sCarb = new G4Sphere("CarbRing",
            fRadius1+fRadius2, fRadius1+fRadius2+fRadius3, 0., twopi, 0., pi);

  fLMat3 = new G4LogicalVolume(sCarb,
                    fMaterial3,
                    fMaterial3->GetName());

    new G4PVPlacement(0,                         //no rotation
                    G4ThreeVector(),             //at (0,0,0)
                    fLMat3,                     //logical volume
                    fMaterial3->GetName(),        //name
                    lWorld,                      //mother  volume
                    false,                       //no boolean operation
                    0);                          //copy number

  //Boric Acid Ring
  //
  G4Sphere *
  sBHO = new G4Sphere("BHORing",
            fRadius1+fRadius2+fRadius3, fRadius1+fRadius2+fRadius3+fRadius4, 0., twopi, 0., pi);

  fLMat4 = new G4LogicalVolume(sBHO,
                    fMaterial4,
                    fMaterial4->GetName());

    new G4PVPlacement(0,                         //no rotation
                    G4ThreeVector(),             //at (0,0,0)
                    fLMat4,                     //logical volume
                    fMaterial4->GetName(),        //name
                    lWorld,                      //mother  volume
                    false,                       //no boolean operation
                    0);                          //copy number
  PrintParameters();
  //always return the root volume
  //
  return fPWorld;
}

//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......

void DetectorConstruction::PrintParameters()
{
  G4cout << "\n The Absorber is " << G4BestUnit(fRadSum,"Length")
         << " of " << fMaterial1->GetName()
         << " then " << fMaterial2->GetName()
         << " then " << fMaterial3->GetName()
         << " then " << fMaterial4->GetName()
         << "\n \n" << fMaterial1 << G4endl;
}

//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......

void DetectorConstruction::SetMaterial1(G4String materialChoice)
{
  // search the material by its name
  G4Material* pttoMaterial =
     G4NistManager::Instance()->FindOrBuildMaterial(materialChoice);

  if (pttoMaterial) {
    fMaterial1 = pttoMaterial;
    if(fLMat1) { fLMat1->SetMaterial(fMaterial1); }
    G4RunManager::GetRunManager()->PhysicsHasBeenModified();
  } else {
    G4cout << "\n--> warning from DetectorConstruction::SetMaterial1 : "
           << materialChoice << " not found" << G4endl;
  }
}

void DetectorConstruction::SetMaterial2(G4String materialChoice)
{
  // search the material by its name
  G4Material* pttoMaterial =
     G4NistManager::Instance()->FindOrBuildMaterial(materialChoice);

  if (pttoMaterial) {
    fMaterial2 = pttoMaterial;
    if(fLMat2) { fLMat2->SetMaterial(fMaterial2); }
    G4RunManager::GetRunManager()->PhysicsHasBeenModified();
  } else {
    G4cout << "\n--> warning from DetectorConstruction::SetMaterial2 : "
           << materialChoice << " not found" << G4endl;
  }
}

void DetectorConstruction::SetMaterial3(G4String materialChoice)
{
  // search the material by its name
  G4Material* pttoMaterial =
     G4NistManager::Instance()->FindOrBuildMaterial(materialChoice);

  if (pttoMaterial) {
    fMaterial3 = pttoMaterial;
    if(fLMat3) { fLMat3->SetMaterial(fMaterial3); }
    G4RunManager::GetRunManager()->PhysicsHasBeenModified();
  } else {
    G4cout << "\n--> warning from DetectorConstruction::SetMaterial3 : "
           << materialChoice << " not found" << G4endl;
  }
}

void DetectorConstruction::SetMaterial4(G4String materialChoice)
{
  // search the material by its name
  G4Material* pttoMaterial =
     G4NistManager::Instance()->FindOrBuildMaterial(materialChoice);

  if (pttoMaterial) {
    fMaterial4 = pttoMaterial;
    if(fLMat4) { fLMat4->SetMaterial(fMaterial4); }
    G4RunManager::GetRunManager()->PhysicsHasBeenModified();
  } else {
    G4cout << "\n--> warning from DetectorConstruction::SetMaterial4 : "
           << materialChoice << " not found" << G4endl;
  }
}


//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......

void DetectorConstruction::SetRadius1(G4double value)
{
  fRadius1 = value;
  G4RunManager::GetRunManager()->ReinitializeGeometry();
}

void DetectorConstruction::SetRadius2(G4double value)
{
  fRadius2 = value;
  G4RunManager::GetRunManager()->ReinitializeGeometry();
}

void DetectorConstruction::SetRadius3(G4double value)
{
  fRadius3 = value;
  G4RunManager::GetRunManager()->ReinitializeGeometry();
}

void DetectorConstruction::SetRadius4(G4double value)
{
  fRadius4 = value;
  G4RunManager::GetRunManager()->ReinitializeGeometry();
}
//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......
