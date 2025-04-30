import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import axios from 'axios'; // Certifique-se de que axios está instalado

// Componente para a seção de Gerenciamento de Usuários
const UserManagement = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingFeeUser, setEditingFeeUser] = useState(null); // Para modal de taxa
    const [newFee, setNewFee] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('/api/admin/users', config);
            setUsers(data || []); // Garante que users seja sempre um array
        } catch (err) {
            console.error("Erro ao buscar usuários:", err);
            setError(err.response?.data?.message || 'Erro ao buscar usuários.');
            setUsers([]); // Limpa usuários em caso de erro
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token]);

    const handleToggleBlock = async (userId, currentBlockedStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const block = !currentBlockedStatus;
            await axios.patch(`/api/admin/users/${userId}/toggle-block`, { block }, config);
            // Atualiza a lista localmente ou busca novamente
            setUsers(users.map(u => u.id === userId ? { ...u, blocked: block } : u));
            alert(`Usuário ${block ? 'bloqueado' : 'desbloqueado'} com sucesso!`);
        } catch (err) {
            console.error("Erro ao bloquear/desbloquear usuário:", err);
            alert(err.response?.data?.message || 'Erro ao atualizar status do usuário.');
        }
    };

    const handleOpenFeeModal = (user) => {
        if (user.userType === 'printer' || user.userType === 'stationery') {
            setEditingFeeUser(user);
            setNewFee(user.platformFee !== undefined ? user.platformFee.toString() : '');
        } else {
            alert('Taxa só pode ser definida para gráficas/papelarias.');
        }
    };

    const handleSetFee = async (e) => {
        e.preventDefault();
        if (!editingFeeUser || newFee === '') return;
        const feeValue = parseFloat(newFee);
        if (isNaN(feeValue) || feeValue < 0 || feeValue > 100) {
            alert('Taxa inválida. Deve ser um número entre 0 e 100.');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.patch(`/api/admin/users/${editingFeeUser.id}/set-fee`, { platformFee: feeValue }, config);
            setUsers(users.map(u => u.id === editingFeeUser.id ? { ...u, platformFee: feeValue } : u));
            alert(`Taxa definida para ${feeValue}% para o usuário ${editingFeeUser.name || editingFeeUser.id}.`);
            setEditingFeeUser(null);
            setNewFee('');
        } catch (err) {
            console.error("Erro ao definir taxa:", err);
            alert(err.response?.data?.message || 'Erro ao definir taxa.');
        }
    };

    if (loading) return <p>Carregando usuários...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4">Gerenciar Usuários</h3>
            {users.length === 0 ? (
                <p>Nenhum usuário encontrado.</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">Nome</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Tipo</th>
                            <th className="py-2 px-4 border-b">Bloqueado</th>
                            <th className="py-2 px-4 border-b">Taxa (%)</th>
                            <th className="py-2 px-4 border-b">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b text-sm">{user.id}</td>
                                <td className="py-2 px-4 border-b">{user.name || 'N/A'}</td>
                                <td className="py-2 px-4 border-b">{user.email}</td>
                                <td className="py-2 px-4 border-b">{user.userType}</td>
                                <td className="py-2 px-4 border-b">{user.blocked ? 'Sim' : 'Não'}</td>
                                <td className="py-2 px-4 border-b">{user.userType === 'printer' || user.userType === 'stationery' ? (user.platformFee !== undefined ? user.platformFee : 'N/D') : '-'}</td>
                                <td className="py-2 px-4 border-b space-x-2">
                                    <button
                                        onClick={() => handleToggleBlock(user.id, user.blocked)}
                                        className={`px-2 py-1 text-xs rounded ${user.blocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
                                    >
                                        {user.blocked ? 'Desbloquear' : 'Bloquear'}
                                    </button>
                                    {(user.userType === 'printer' || user.userType === 'stationery') && (
                                        <button
                                            onClick={() => handleOpenFeeModal(user)}
                                            className="px-2 py-1 text-xs rounded bg-blue-500 hover:bg-blue-600 text-white"
                                        >
                                            Definir Taxa
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal para definir taxa */}
            {editingFeeUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                        <h4 className="text-lg font-semibold mb-4">Definir Taxa para {editingFeeUser.name || editingFeeUser.id}</h4>
                        <form onSubmit={handleSetFee}>
                            <label htmlFor="platformFee" className="block text-sm font-medium text-gray-700 mb-1">Taxa da Plataforma (%)</label>
                            <input
                                type="number"
                                id="platformFee"
                                value={newFee}
                                onChange={(e) => setNewFee(e.target.value)}
                                min="0"
                                max="100"
                                step="0.1"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4"
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingFeeUser(null)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Salvar Taxa
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente para a seção de Gerenciamento de Serviços
const ServiceManagement = ({ token }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'

    const fetchServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const url = statusFilter !== 'all' ? `/api/admin/services?status=${statusFilter}` : '/api/admin/services';
            const { data } = await axios.get(url, config);
            setServices(data || []);
        } catch (err) {
            console.error("Erro ao buscar serviços:", err);
            setError(err.response?.data?.message || 'Erro ao buscar serviços.');
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchServices();
        }
    }, [token, statusFilter]);

    const handleApproveReject = async (serviceId, approve) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.patch(`/api/admin/services/${serviceId}/approval`, { approved: approve }, config);
            // Atualiza a lista localmente
            setServices(services.map(s => s.id === serviceId ? { ...s, approved: approve, status: approve ? 'approved' : 'rejected' } : s));
            alert(`Serviço ${approve ? 'aprovado' : 'rejeitado'} com sucesso!`);
        } catch (err) {
            console.error("Erro ao aprovar/rejeitar serviço:", err);
            alert(err.response?.data?.message || 'Erro ao atualizar status do serviço.');
        }
    };

    const handleDeleteService = async (serviceId) => {
        if (!confirm('Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.')) {
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`/api/admin/services/${serviceId}`, config);
            // Remove o serviço da lista
            setServices(services.filter(s => s.id !== serviceId));
            alert('Serviço excluído com sucesso!');
        } catch (err) {
            console.error("Erro ao excluir serviço:", err);
            alert(err.response?.data?.message || 'Erro ao excluir serviço.');
        }
    };

    if (loading) return <p>Carregando serviços...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4">Gerenciar Serviços</h3>
            
            {/* Filtros */}
            <div className="mb-4">
                <label htmlFor="statusFilter" className="mr-2">Filtrar por status:</label>
                <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="all">Todos</option>
                    <option value="pending">Pendentes</option>
                    <option value="approved">Aprovados</option>
                    <option value="rejected">Rejeitados</option>
                </select>
            </div>

            {services.length === 0 ? (
                <p>Nenhum serviço encontrado.</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">Título</th>
                            <th className="py-2 px-4 border-b">Gráfica</th>
                            <th className="py-2 px-4 border-b">Preço</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Data de Criação</th>
                            <th className="py-2 px-4 border-b">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b text-sm">{service.id}</td>
                                <td className="py-2 px-4 border-b">{service.title}</td>
                                <td className="py-2 px-4 border-b">{service.printerName || service.printerId || 'N/A'}</td>
                                <td className="py-2 px-4 border-b">R$ {service.price?.toFixed(2) || 'N/A'}</td>
                                <td className="py-2 px-4 border-b">
                                    <span className={`px-2 py-1 text-xs rounded ${
                                        service.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                        service.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {service.status === 'approved' ? 'Aprovado' : 
                                         service.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                                    </span>
                                </td>
                                <td className="py-2 px-4 border-b">{new Date(service.createdAt).toLocaleDateString('pt-BR')}</td>
                                <td className="py-2 px-4 border-b space-x-2">
                                    {service.status !== 'approved' && (
                                        <button
                                            onClick={() => handleApproveReject(service.id, true)}
                                            className="px-2 py-1 text-xs rounded bg-green-500 hover:bg-green-600 text-white"
                                        >
                                            Aprovar
                                        </button>
                                    )}
                                    {service.status !== 'rejected' && (
                                        <button
                                            onClick={() => handleApproveReject(service.id, false)}
                                            className="px-2 py-1 text-xs rounded bg-red-500 hover:bg-red-600 text-white"
                                        >
                                            Rejeitar
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteService(service.id)}
                                        className="px-2 py-1 text-xs rounded bg-gray-500 hover:bg-gray-600 text-white"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

// Componente para a seção de Gerenciamento de Pedidos
const OrderManagement = ({ token }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null); // Para modal de status
    const [newStatus, setNewStatus] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('/api/admin/orders', config);
            setOrders(data || []);
        } catch (err) {
            console.error("Erro ao buscar pedidos:", err);
            setError(err.response?.data?.message || 'Erro ao buscar pedidos.');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    const handleOpenStatusModal = (order) => {
        setEditingOrder(order);
        setNewStatus(order.status || '');
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        if (!editingOrder || !newStatus) return;

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.patch(`/api/admin/orders/${editingOrder.id}/status`, { status: newStatus }, config);
            // Atualiza a lista localmente
            setOrders(orders.map(o => o.id === editingOrder.id ? { ...o, status: newStatus } : o));
            alert(`Status do pedido atualizado para ${newStatus} com sucesso!`);
            setEditingOrder(null);
        } catch (err) {
            console.error("Erro ao atualizar status do pedido:", err);
            alert(err.response?.data?.message || 'Erro ao atualizar status do pedido.');
        }
    };

    if (loading) return <p>Carregando pedidos...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4">Gerenciar Pedidos</h3>
            {orders.length === 0 ? (
                <p>Nenhum pedido encontrado.</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">Cliente</th>
                            <th className="py-2 px-4 border-b">Gráfica</th>
                            <th className="py-2 px-4 border-b">Valor Total</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Data</th>
                            <th className="py-2 px-4 border-b">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b text-sm">{order.id}</td>
                                <td className="py-2 px-4 border-b">{order.clientName || order.clientId || 'N/A'}</td>
                                <td className="py-2 px-4 border-b">{order.printerName || order.printerId || 'N/A'}</td>
                                <td className="py-2 px-4 border-b">R$ {order.totalAmount?.toFixed(2) || 'N/A'}</td>
                                <td className="py-2 px-4 border-b">
                                    <span className={`px-2 py-1 text-xs rounded ${
                                        order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                        order.status === 'dispute' ? 'bg-orange-100 text-orange-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {order.status || 'Pendente'}
                                    </span>
                                </td>
                                <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleOpenStatusModal(order)}
                                        className="px-2 py-1 text-xs rounded bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                        Alterar Status
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal para alterar status */}
            {editingOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                        <h4 className="text-lg font-semibold mb-4">Alterar Status do Pedido #{editingOrder.id}</h4>
                        <form onSubmit={handleUpdateStatus}>
                            <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700 mb-1">Status do Pedido</label>
                            <select
                                id="orderStatus"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4"
                            >
                                <option value="">Selecione um status</option>
                                <option value="pending">Pendente</option>
                                <option value="processing">Em Processamento</option>
                                <option value="shipped">Enviado</option>
                                <option value="delivered">Entregue</option>
                                <option value="cancelled">Cancelado</option>
                                <option value="dispute">Em Disputa</option>
                            </select>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingOrder(null)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Atualizar Status
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente para a seção de Gerenciamento de Cupons
const CouponManagement = ({ token }) => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        expiryDate: '',
        maxUses: '',
        description: ''
    });

    const fetchCoupons = async () => {
        setLoading(true);
        setError(null);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('/api/admin/coupons', config);
            setCoupons(data || []);
        } catch (err) {
            console.error("Erro ao buscar cupons:", err);
            setError(err.response?.data?.message || 'Erro ao buscar cupons.');
            setCoupons([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCoupons();
        }
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const resetForm = () => {
        setFormData({
            code: '',
            discountType: 'percentage',
            discountValue: '',
            expiryDate: '',
            maxUses: '',
            description: ''
        });
    };

    const handleOpenCreateModal = () => {
        resetForm();
        setEditingCoupon(null);
        setShowCreateModal(true);
    };

    const handleOpenEditModal = (coupon) => {
        setFormData({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue.toString(),
            expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
            maxUses: coupon.maxUses ? coupon.maxUses.toString() : '',
            description: coupon.description || ''
        });
        setEditingCoupon(coupon);
        setShowCreateModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validação básica
        if (!formData.code || !formData.discountValue) {
            alert('Código e valor do desconto são obrigatórios.');
            return;
        }

        const couponData = {
            ...formData,
            discountValue: parseFloat(formData.discountValue),
            maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined
        };

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            if (editingCoupon) {
                // Atualizar cupom existente
                await axios.patch(`/api/admin/coupons/${editingCoupon.id}`, couponData, config);
                setCoupons(coupons.map(c => c.id === editingCoupon.id ? { ...c, ...couponData } : c));
                alert('Cupom atualizado com sucesso!');
            } else {
                // Criar novo cupom
                const { data } = await axios.post('/api/admin/coupons', couponData, config);
                setCoupons([...coupons, data.coupon]);
                alert('Cupom criado com sucesso!');
            }
            
            setShowCreateModal(false);
            resetForm();
        } catch (err) {
            console.error("Erro ao salvar cupom:", err);
            alert(err.response?.data?.message || 'Erro ao salvar cupom.');
        }
    };

    const handleDeleteCoupon = async (couponId) => {
        if (!confirm('Tem certeza que deseja excluir este cupom? Esta ação não pode ser desfeita.')) {
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`/api/admin/coupons/${couponId}`, config);
            setCoupons(coupons.filter(c => c.id !== couponId));
            alert('Cupom excluído com sucesso!');
        } catch (err) {
            console.error("Erro ao excluir cupom:", err);
            alert(err.response?.data?.message || 'Erro ao excluir cupom.');
        }
    };

    const handleToggleActive = async (couponId, currentActiveStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const isActive = !currentActiveStatus;
            await axios.patch(`/api/admin/coupons/${couponId}`, { isActive }, config);
            setCoupons(coupons.map(c => c.id === couponId ? { ...c, isActive } : c));
            alert(`Cupom ${isActive ? 'ativado' : 'desativado'} com sucesso!`);
        } catch (err) {
            console.error("Erro ao ativar/desativar cupom:", err);
            alert(err.response?.data?.message || 'Erro ao atualizar status do cupom.');
        }
    };

    if (loading) return <p>Carregando cupons...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Gerenciar Cupons</h3>
                <button
                    onClick={handleOpenCreateModal}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    Criar Novo Cupom
                </button>
            </div>

            {coupons.length === 0 ? (
                <p>Nenhum cupom encontrado.</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">Código</th>
                            <th className="py-2 px-4 border-b">Tipo</th>
                            <th className="py-2 px-4 border-b">Valor</th>
                            <th className="py-2 px-4 border-b">Validade</th>
                            <th className="py-2 px-4 border-b">Usos</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{coupon.code}</td>
                                <td className="py-2 px-4 border-b">{coupon.discountType === 'percentage' ? 'Percentual' : 'Valor Fixo'}</td>
                                <td className="py-2 px-4 border-b">
                                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `R$ ${coupon.discountValue.toFixed(2)}`}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString('pt-BR') : 'Sem validade'}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {coupon.uses || 0} / {coupon.maxUses || '∞'}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <span className={`px-2 py-1 text-xs rounded ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {coupon.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                                <td className="py-2 px-4 border-b space-x-2">
                                    <button
                                        onClick={() => handleToggleActive(coupon.id, coupon.isActive)}
                                        className={`px-2 py-1 text-xs rounded ${coupon.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                                    >
                                        {coupon.isActive ? 'Desativar' : 'Ativar'}
                                    </button>
                                    <button
                                        onClick={() => handleOpenEditModal(coupon)}
                                        className="px-2 py-1 text-xs rounded bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCoupon(coupon.id)}
                                        className="px-2 py-1 text-xs rounded bg-gray-500 hover:bg-gray-600 text-white"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal para criar/editar cupom */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h4 className="text-lg font-semibold mb-4">
                            {editingCoupon ? 'Editar Cupom' : 'Criar Novo Cupom'}
                        </h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Código do Cupom*</label>
                                <input
                                    type="text"
                                    id="code"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    disabled={editingCoupon} // Não permitir editar o código
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="discountType" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Desconto*</label>
                                <select
                                    id="discountType"
                                    name="discountType"
                                    value={formData.discountType}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="percentage">Percentual (%)</option>
                                    <option value="fixed">Valor Fixo (R$)</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 mb-1">
                                    Valor do Desconto* ({formData.discountType === 'percentage' ? '%' : 'R$'})
                                </label>
                                <input
                                    type="number"
                                    id="discountValue"
                                    name="discountValue"
                                    value={formData.discountValue}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    max={formData.discountType === 'percentage' ? "100" : undefined}
                                    step={formData.discountType === 'percentage' ? "1" : "0.01"}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Data de Validade</label>
                                <input
                                    type="date"
                                    id="expiryDate"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="maxUses" className="block text-sm font-medium text-gray-700 mb-1">Número Máximo de Usos</label>
                                <input
                                    type="number"
                                    id="maxUses"
                                    name="maxUses"
                                    value={formData.maxUses}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">Deixe em branco para usos ilimitados</p>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    {editingCoupon ? 'Atualizar Cupom' : 'Criar Cupom'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente principal do Dashboard
const AdminDashboard = () => {
    const { user, loading: authLoading, token } = useContext(AuthContext);
    const router = useRouter();
    const [activeSection, setActiveSection] = useState('users'); // 'users', 'services', 'orders', 'coupons'

    useEffect(() => {
        // Redireciona se não estiver logado, não for admin ou ainda estiver carregando
        if (!authLoading && (!user || user.userType !== 'admin')) {
            router.push('/login'); // Ou para uma página de acesso negado
        }
    }, [user, authLoading, router]);

    // Exibe carregando enquanto a autenticação verifica
    if (authLoading || !user || user.userType !== 'admin') {
        return <div className="flex justify-center items-center h-screen"><p>Carregando...</p></div>;
    }

    // Renderiza o conteúdo do dashboard
    const renderSection = () => {
        switch (activeSection) {
            case 'users':
                return <UserManagement token={token} />;
            case 'services':
                return <ServiceManagement token={token} />;
            case 'orders':
                return <OrderManagement token={token} />;
            case 'coupons':
                return <CouponManagement token={token} />;
            default:
                return <p>Selecione uma seção</p>;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>

            {/* Navegação do Painel */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveSection('users')}
                        className={`${activeSection === 'users' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Usuários
                    </button>
                    <button
                        onClick={() => setActiveSection('services')}
                        className={`${activeSection === 'services' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Serviços
                    </button>
                    <button
                        onClick={() => setActiveSection('orders')}
                        className={`${activeSection === 'orders' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Pedidos
                    </button>
                    <button
                        onClick={() => setActiveSection('coupons')}
                        className={`${activeSection === 'coupons' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Cupons
                    </button>
                </nav>
            </div>

            {/* Conteúdo da Seção Ativa */}
            <div>
                {renderSection()}
            </div>
        </div>
    );
};

export default AdminDashboard;
