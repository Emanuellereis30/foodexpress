import React, { useState } from 'react';
import {
 SafeAreaView,
 View,
 Text,
 Button,
 ScrollView,
 ActivityIndicator,
 StyleSheet
} from 'react-native';
import * as Location from 'expo-location';
type Coordenadas = {
 latitude: number;
 longitude: number;
};
export default function App() {
 const [localizacao, setLocalizacao] =
 useState<Coordenadas | null>(null);
 const [restaurantes, setRestaurantes] =
 useState<any[]>([]);
 const [loading, setLoading] =
 useState(false);
 async function localizar() {
 const { status } =
 await Location.requestForegroundPermissionsAsync();
 if (status !== 'granted') {
 alert('Permissão negada');
 return;
 }
 const posicao =
 await Location.getCurrentPositionAsync({});
 setLocalizacao({
 latitude: posicao.coords.latitude,
 longitude: posicao.coords.longitude,
 });
 }
 async function buscarRestaurantes() {
 try {
 setLoading(true);
 const resposta = await fetch(
 'https://nominatim.openstreetmap.org/search?q=restaurante&format=json'
 );
 const dados = await resposta.json();
 setRestaurantes(dados.slice(0, 4));
 } catch (erro) {
 console.log(erro);
 } finally {
 setLoading(false);
 }
 }
 return (
 <SafeAreaView style={styles.container}>
 <ScrollView>
 <View style={styles.botao}>
 <Button
 title="Obter Localização"
 onPress={localizar}
 />
 </View>
 <Text style={styles.texto}>
 Latitude: {localizacao?.latitude}
 </Text>
 <Text style={styles.texto}>
 Longitude: {localizacao?.longitude}
 </Text>
 <View style={styles.botao}>
 <Button
 title="Buscar Restaurantes"
 onPress={buscarRestaurantes}
 />
 </View>
 {loading && (
 <ActivityIndicator
 size="large"
 style={{ marginTop: 20 }}
 />
 )}
 {!loading && restaurantes.length === 0 && (
 <Text style={styles.vazio}>
 Nenhum restaurante encontrado
 </Text>
 )}
 {restaurantes.map((item, index) => (
 <View
 key={index}
 style={styles.card}
 >
 <Text style={styles.label}>
 Nome:
 <Text style={styles.valor}>
 {' '}
 {item.name || 'Restaurante'}
 </Text>
 </Text>
 <Text style={styles.label}>
 Endereço:
 <Text style={styles.valor}>
 {' '}
 {item.display_name}
 </Text>
 </Text>
 <Text style={styles.label}>
 Latitude:
 <Text style={styles.valor}>
 {' '}
 {item.lat}
 </Text>
 </Text>
 <Text style={styles.label}>
 Longitude:
 <Text style={styles.valor}>
 {' '}
 {item.lon}
 </Text>
 </Text>
 </View>
 ))}
 {restaurantes.length > 0 && (
 <Text style={styles.rodape}>
 {restaurantes.length} restaurantes encontrados!
 </Text>
 )}
 </ScrollView>
 </SafeAreaView>
 );
}
const styles = StyleSheet.create({
 container: {
 flex: 1,
 padding: 20,
 marginTop: 40,
 backgroundColor: '#fff',
 },
 botao: {
 marginVertical: 15,
 },
 texto: {
 fontSize: 22,
 marginBottom: 10,
 },
 card: {
 borderBottomWidth: 1,
 borderBottomColor: '#ccc',
 paddingVertical: 20,
 },
 label: {
 fontSize: 20,
 fontWeight: 'bold',
 marginBottom: 8,
 },
 valor: {
 fontWeight: 'normal',
 },
 vazio: {
 textAlign: 'center',
 fontSize: 18,
 marginTop: 30,
 },
 rodape: {
 textAlign: 'center',
 fontSize: 22,
 marginVertical: 30,
 fontWeight: 'bold',
 },
});