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
/// \file DetectorMessenger.cc
/// \brief Implementation of the DetectorMessenger class
//
// $Id: DetectorMessenger.cc 70755 2013-06-05 12:17:48Z ihrivnac $
//
//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......
//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......

#include "DetectorMessenger.hh"

#include "DetectorConstruction.hh"
#include "G4UIdirectory.hh"
#include "G4UIcommand.hh"
#include "G4UIparameter.hh"
#include "G4UIcmdWithAString.hh"
#include "G4UIcmdWithADoubleAndUnit.hh"
#include "G4UIcmdWithoutParameter.hh"

//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......

DetectorMessenger::DetectorMessenger(DetectorConstruction * det)
:G4UImessenger(),
 fDetector(det), fTestemDir(0), fDetDir(0), fMaterCmd1(0), fMaterCmd2(0),  fMaterCmd3(0), fMaterCmd4(0),
 fSizeCmd1(0), fSizeCmd2(0), fSizeCmd3(0), fSizeCmd4(0), fIsotopeCmd(0)
{
  fTestemDir = new G4UIdirectory("/testhadr/");
  fTestemDir->SetGuidance("commands specific to this example");

  G4bool broadcast = false;
  fDetDir = new G4UIdirectory("/testhadr/det/",broadcast);
  fDetDir->SetGuidance("detector construction commands");

  fMaterCmd1 = new G4UIcmdWithAString("/testhadr/det/setMat1",this);
  fMaterCmd1->SetGuidance("Select material of first surface.");
  fMaterCmd1->SetParameterName("choice",false);
  fMaterCmd1->AvailableForStates(G4State_PreInit,G4State_Idle);

  fMaterCmd2 = new G4UIcmdWithAString("/testhadr/det/setMat2",this);
  fMaterCmd2->SetGuidance("Select material of second surface.");
  fMaterCmd2->SetParameterName("choice",false);
  fMaterCmd2->AvailableForStates(G4State_PreInit,G4State_Idle);

  fMaterCmd3 = new G4UIcmdWithAString("/testhadr/det/setMat3",this);
  fMaterCmd3->SetGuidance("Select material third surface.");
  fMaterCmd3->SetParameterName("choice",false);
  fMaterCmd3->AvailableForStates(G4State_PreInit,G4State_Idle);

  fMaterCmd4 = new G4UIcmdWithAString("/testhadr/det/setMat4",this);
  fMaterCmd4->SetGuidance("Select material of outter.");
  fMaterCmd4->SetParameterName("choice",false);
  fMaterCmd4->AvailableForStates(G4State_PreInit,G4State_Idle);

  fSizeCmd1 = new G4UIcmdWithADoubleAndUnit("/testhadr/det/setRadius1",this);
  fSizeCmd1->SetGuidance("Set size of the sphere");
  fSizeCmd1->SetParameterName("Size",false);
  fSizeCmd1->SetRange("Size>0.");
  fSizeCmd1->SetUnitCategory("Length");
  fSizeCmd1->AvailableForStates(G4State_PreInit,G4State_Idle);

  fSizeCmd2 = new G4UIcmdWithADoubleAndUnit("/testhadr/det/setRadius2",this);
  fSizeCmd2->SetGuidance("Set size of the sphere");
  fSizeCmd2->SetParameterName("Size",false);
  fSizeCmd2->SetRange("Size>0.");
  fSizeCmd2->SetUnitCategory("Length");
  fSizeCmd2->AvailableForStates(G4State_PreInit,G4State_Idle);

  fSizeCmd3 = new G4UIcmdWithADoubleAndUnit("/testhadr/det/setRadius3",this);
  fSizeCmd3->SetGuidance("Set size of the sphere");
  fSizeCmd3->SetParameterName("Size",false);
  fSizeCmd3->SetRange("Size>0.");
  fSizeCmd3->SetUnitCategory("Length");
  fSizeCmd3->AvailableForStates(G4State_PreInit,G4State_Idle);

  fSizeCmd4 = new G4UIcmdWithADoubleAndUnit("/testhadr/det/setRadius4",this);
  fSizeCmd4->SetGuidance("Set size of the sphere");
  fSizeCmd4->SetParameterName("Size",false);
  fSizeCmd4->SetRange("Size>0.");
  fSizeCmd4->SetUnitCategory("Length");
  fSizeCmd4->AvailableForStates(G4State_PreInit,G4State_Idle);

  fIsotopeCmd = new G4UIcommand("/testhadr/det/setIsotopeMat",this);
  fIsotopeCmd->SetGuidance("Build and select a material with single isotope");
  fIsotopeCmd->SetGuidance("  symbol of isotope, Z, A, density of material");
  //
  G4UIparameter* symbPrm = new G4UIparameter("isotope",'s',false);
  symbPrm->SetGuidance("isotope symbol");
  fIsotopeCmd->SetParameter(symbPrm);
  //
  G4UIparameter* ZPrm = new G4UIparameter("Z",'i',false);
  ZPrm->SetGuidance("Z");
  ZPrm->SetParameterRange("Z>0");
  fIsotopeCmd->SetParameter(ZPrm);
  //
  G4UIparameter* APrm = new G4UIparameter("A",'i',false);
  APrm->SetGuidance("A");
  APrm->SetParameterRange("A>0");
  fIsotopeCmd->SetParameter(APrm);
  //
  G4UIparameter* densityPrm = new G4UIparameter("density",'d',false);
  densityPrm->SetGuidance("density of material");
  densityPrm->SetParameterRange("density>0.");
  fIsotopeCmd->SetParameter(densityPrm);
  //
  G4UIparameter* unitPrm = new G4UIparameter("unit",'s',false);
  unitPrm->SetGuidance("unit of density");
  G4String unitList = G4UIcommand::UnitsList(G4UIcommand::CategoryOf("g/cm3"));
  unitPrm->SetParameterCandidates(unitList);
  fIsotopeCmd->SetParameter(unitPrm);
  //
  fIsotopeCmd->AvailableForStates(G4State_PreInit,G4State_Idle);
}

//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......

DetectorMessenger::~DetectorMessenger()
{
  delete fMaterCmd1;
  delete fMaterCmd2;
  delete fMaterCmd3;
  delete fMaterCmd4;
  delete fSizeCmd1;
  delete fSizeCmd2;
  delete fSizeCmd3;
  delete fSizeCmd4;
  delete fIsotopeCmd;
  delete fDetDir;
  delete fTestemDir;
}

//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......

void DetectorMessenger::SetNewValue(G4UIcommand* command,G4String newValue)
{
  if( command == fMaterCmd1 )
    { fDetector->SetMaterial1(newValue);}

  if( command == fMaterCmd2 )
    { fDetector->SetMaterial2(newValue);}

  if( command == fMaterCmd3 )
    { fDetector->SetMaterial3(newValue);}

  if( command == fMaterCmd4 )
    { fDetector->SetMaterial4(newValue);}

  if( command == fSizeCmd1 )
    { fDetector->SetRadius1(fSizeCmd1->GetNewDoubleValue(newValue));}

  if( command == fSizeCmd2 )
    { fDetector->SetRadius2(fSizeCmd2->GetNewDoubleValue(newValue));}

  if( command == fSizeCmd3 )
    { fDetector->SetRadius3(fSizeCmd3->GetNewDoubleValue(newValue));}

  if( command == fSizeCmd4 )
    { fDetector->SetRadius4(fSizeCmd4->GetNewDoubleValue(newValue));}

  if (command == fIsotopeCmd)
   {
     G4int Z; G4int A; G4double dens;
     G4String name, unt;
     std::istringstream is(newValue);
     is >> name >> Z >> A >> dens >> unt;
     dens *= G4UIcommand::ValueOf(unt);
     fDetector->MaterialWithSingleIsotope (name,name,dens,Z,A);
     fDetector->SetMaterial1(name);
   }
}

//....oooOO0OOooo........oooOO0OOooo........oooOO0OOooo........oooOO0OOooo......
