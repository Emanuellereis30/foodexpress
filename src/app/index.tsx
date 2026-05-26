import { useEffect, useState } from 'react';
import {
  Alert,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar
} from 'react-native';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc
} from 'firebase/firestore';

import { db } from '../../firebaseConfig';

type Produto = {
  id: string;
  nome: string;
  preco: number;
  categoria: string;
  descricao: string;
};

export default function App() {

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    listarProdutos();
  }, []);

  async function listarProdutos() {

    try {

      const querySnapshot = await getDocs(
        collection(db, 'products')
      );

      const lista: Produto[] = [];

      querySnapshot.forEach((item) => {

        lista.push({
          id: item.id,
          ...(item.data() as Omit<Produto, 'id'>)
        });

      });

      setProdutos(lista);

    } catch (error) {

      Alert.alert(
        'Erro',
        'Não foi possível carregar os produtos'
      );

    }
  }

  async function handleSalvar() {

    if (
      nome.trim() === '' ||
      preco.trim() === '' ||
      categoria.trim() === '' ||
      descricao.trim() === ''
    ) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const precoNumerico = Number(preco);

    if (precoNumerico <= 0 || isNaN(precoNumerico)) {
      Alert.alert('Erro', 'Preço inválido');
      return;
    }

    try {

      if (editandoId) {

        const produtoRef = doc(
          db,
          'products',
          editandoId
        );

        await updateDoc(produtoRef, {
          nome,
          preco: precoNumerico,
          categoria,
          descricao
        });

        Alert.alert(
          'Sucesso',
          'Produto atualizado'
        );

      } else {

        await addDoc(collection(db, 'products'), {
          nome,
          preco: precoNumerico,
          categoria,
          descricao
        });

        Alert.alert(
          'Sucesso',
          'Produto cadastrado'
        );
      }

      limparCampos();
      listarProdutos();

    } catch (error) {

      Alert.alert(
        'Erro',
        'Não foi possível salvar'
      );

    }
  }

  function editarProduto(produto: Produto) {

    setNome(produto.nome);
    setPreco(String(produto.preco));
    setCategoria(produto.categoria);
    setDescricao(produto.descricao);

    setEditandoId(produto.id);
  }

  async function deletarProduto(id: string) {

    try {

      await deleteDoc(
        doc(db, 'products', id)
      );

      Alert.alert(
        'Sucesso',
        'Produto deletado'
      );

      listarProdutos();

    } catch (error) {

      Alert.alert(
        'Erro',
        'Não foi possível deletar'
      );

    }
  }

  function limparCampos() {

    setNome('');
    setPreco('');
    setCategoria('');
    setDescricao('');
    setEditandoId(null);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        <View style={styles.header}>

          <Text style={styles.title}>
            FoodExpress 
          </Text>
        </View>

        <View style={styles.card}>

          <Text style={styles.label}>
            Nome do produto
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Digite o nome"
            placeholderTextColor="#9CA3AF"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>
            Preço
          </Text>

          <TextInput
            style={styles.input}
            placeholder="R$ 0,00"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={preco}
            onChangeText={setPreco}
          />

          <Text style={styles.label}>
            Categoria
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: Lanches"
            placeholderTextColor="#9CA3AF"
            value={categoria}
            onChangeText={setCategoria}
          />

          <Text style={styles.label}>
            Descrição
          </Text>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Digite a descrição..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={descricao}
            onChangeText={setDescricao}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSalvar}
          >
            <Text style={styles.buttonText}>
              {editandoId
                ? 'Atualizar Produto'
                : 'Cadastrar Produto'}
            </Text>
          </TouchableOpacity>

        </View>

        <View style={{ marginTop: 30 }}>

          {produtos.map((produto) => (

            <View
              key={produto.id}
              style={styles.productCard}
            >

              <Text style={styles.productName}>
                {produto.nome}
              </Text>

              <Text style={styles.productInfo}>
                💰 R$ {produto.preco}
              </Text>

              <Text style={styles.productInfo}>
                🍔 {produto.categoria}
              </Text>

              <Text style={styles.productDescription}>
                {produto.descricao}
              </Text>

              <View style={styles.actions}>

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() =>
                    editarProduto(produto)
                  }
                >
                  <Text style={styles.actionText}>
                    Editar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() =>
                    deletarProduto(produto.id)
                  }
                >
                  <Text style={styles.actionText}>
                    Excluir
                  </Text>
                </TouchableOpacity>

              </View>

            </View>

          ))}

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0F172A'
  },

  scroll: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40
  },

  header: {
    marginBottom: 30
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 15,
    marginBottom: 6
  },

  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    marginTop: 10
  },

  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    borderRadius: 16,
    fontSize: 15,
    color: '#0F172A'
  },

  textArea: {
    height: 120,
    textAlignVertical: 'top'
  },

  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 18,
    borderRadius: 18,
    marginTop: 24,
    alignItems: 'center'
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },

  productCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 20,
    marginBottom: 18
  },

  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8
  },

  productInfo: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 4
  },

  productDescription: {
    marginTop: 10,
    color: '#334155',
    lineHeight: 22
  },

  actions: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 12
  },

  editButton: {
    flex: 1,
    backgroundColor: '#F59E0B',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center'
  },

  deleteButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center'
  },

  actionText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  }

});