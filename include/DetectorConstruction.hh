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
/// \file DetectorConstruction.hh
/// \brief Definition of the DetectorConstruction class
//
// $Id: DetectorConstruction.hh 66586 2012-12-21 10:48:39Z ihrivnac $
//

//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......
//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......

#ifndef DetectorConstruction_h
#define DetectorConstruction_h 1

#include "G4VUserDetectorConstruction.hh"
#include "globals.hh"

class G4LogicalVolume;
class G4Material;
class DetectorMessenger;

//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......

class DetectorConstruction : public G4VUserDetectorConstruction
{
  public:

    DetectorConstruction();
   ~DetectorConstruction();

  public:

    virtual G4VPhysicalVolume* Construct();

    G4Material*
    MaterialWithSingleIsotope(G4String, G4String, G4double, G4int, G4int);

    void SetRadius1   (G4double);
    void SetRadius2   (G4double);
    void SetRadius3   (G4double);
    void SetRadius4   (G4double);
    void SetMaterial1 (G4String);
    void SetMaterial2 (G4String);
    void SetMaterial3 (G4String);
    void SetMaterial4 (G4String);

  public:

     G4double           GetRadius1()     {return fRadius1;};
     G4double           GetRadius2()     {return fRadius2;};
     G4double           GetRadius3()     {return fRadius3;};
     G4double           GetRadius4()     {return fRadius4;};
     G4Material*        GetMaterial1()   {return fMaterial1;};
     G4Material*        GetMaterial2()   {return fMaterial2;};
     G4Material*        GetMaterial3()   {return fMaterial3;};
     G4Material*        GetMaterial4()   {return fMaterial4;};

     void               PrintParameters();

  private:

     G4double           fRadSum, fRadius1, fRadius2, fRadius3, fRadius4;
     G4Material*        fMaterial1;
     G4Material*        fMaterial2;
     G4Material*        fMaterial3;
     G4Material*        fMaterial4;
     //G4LogicalVolume*   fLAbsor;
     //G4LogicalVolume*   fLBeryl;
     G4LogicalVolume*   fLMat1;
     G4LogicalVolume*   fLMat2;
     G4LogicalVolume*   fLMat3;
     G4LogicalVolume*   fLMat4;

     G4double           fWorldSize;
     G4Material*        fWorldMat;
     G4VPhysicalVolume* fPWorld;

     DetectorMessenger* fDetectorMessenger;

  private:

     void               DefineMaterials();
     G4VPhysicalVolume* ConstructVolumes();
};

//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......


#endif
