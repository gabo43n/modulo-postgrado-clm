import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import CLMHomeScreen from '../screens/CLMHomeScreen';
import ContratosScreen from '../screens/ContratosScreen';
import ClausulasScreen from '../screens/ClausulasScreen';
import AddEmpresaScreen from '../screens/AddEmpresaScreen';
import AddContratoScreen from '../screens/AddContratoScreen';
import AddClausulaScreen from '../screens/AddClausulaScreen';
import EditEmpresaScreen from '../screens/EditEmpresaScreen';
import EditContratoScreen from '../screens/EditContratoScreen';
import EditClausulaScreen from '../screens/EditClausulaScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Acceso CLM' }}
      />
      <Stack.Screen
        name="Home"
        component={CLMHomeScreen}
        options={{ title: 'Gestión de Empresas' }}
      />
      <Stack.Screen
        name="Contratos"
        component={ContratosScreen}
        options={{ title: 'Lista de Contratos' }}
      />
      <Stack.Screen
        name="Clausulas"
        component={ClausulasScreen}
        options={{ title: 'Detalle de Cláusulas' }}
      />
      <Stack.Screen
        name="AddEmpresa"
        component={AddEmpresaScreen}
        options={{ title: 'Añadir Empresa' }}
      />
      <Stack.Screen
        name="AddContrato"
        component={AddContratoScreen}
        options={{ title: 'Añadir Contrato' }}
      />
      <Stack.Screen
        name="AddClausula"
        component={AddClausulaScreen}
        options={{ title: 'Añadir Cláusula' }}
      />
      <Stack.Screen
        name="EditEmpresa"
        component={EditEmpresaScreen}
        options={{ title: 'Editar Empresa' }}
      />
      <Stack.Screen
        name="EditContrato"
        component={EditContratoScreen}
        options={{ title: 'Editar Contrato' }}
      />
      <Stack.Screen
        name="EditClausula"
        component={EditClausulaScreen}
        options={{ title: 'Editar Cláusula' }}
      />
    </Stack.Navigator>
  );
}