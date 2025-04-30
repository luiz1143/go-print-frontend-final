import { storage } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid'; // Para gerar nomes de arquivo únicos

/**
 * Faz upload de um arquivo para o Firebase Storage.
 * 
 * @param {File} file O arquivo a ser enviado.
 * @param {string} path O caminho no Storage onde o arquivo será salvo (ex: 'service-images', 'order-files').
 * @param {function} onProgress Callback para acompanhar o progresso do upload (opcional).
 * @returns {Promise<string>} Uma promessa que resolve com a URL de download do arquivo.
 */
export const uploadFile = (file, path, onProgress) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject("Nenhum arquivo fornecido.");
    }

    // Gera um nome de arquivo único para evitar sobrescritas
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const storagePath = `${path}/${uniqueFileName}`;
    
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        // Acompanha o progresso do upload
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        if (onProgress) {
          onProgress(progress);
        }
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // Trata erros de upload
        console.error("Erro no upload:", error);
        reject(`Falha no upload do arquivo: ${error.code}`);
      }, 
      () => {
        // Upload concluído com sucesso, obtém a URL de download
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          resolve(downloadURL);
        }).catch(error => {
          console.error("Erro ao obter URL de download:", error);
          reject("Falha ao obter URL de download após upload.");
        });
      }
    );
  });
};

