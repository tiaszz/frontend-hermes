import { useState } from "react";
import { StatCard, Badge, Icon, Modal, useToast } from "../components/UI.jsx";
import { C } from "../styles.js";
import { useApp } from "../context/AppContext.jsx";

function Painel({ setPage }) {
    const {
        comunicacoes,
        removeComunicacao,
        updateComunicacaoStatus,
        stats,
        loading,
        error,
        fetchComunicacoes,
    } = useApp();

    const [confirmDelete, setConfirmDelete] = useState(null);
    const { show, Toast } = useToast();

    const recentes = comunicacoes.slice(0, 4);

    return (
        <>
            <div className="topbar">
                <div>
                    <div className="page-title">Painel</div>
                    <div className="page-sub">
                        Visão geral das comunicações e da saúde do sistema.
                    </div>
                </div>
                <div className="flex gap-10">
                    <button
                        className="btn btn-secondary"
                        onClick={() => fetchComunicacoes()}
                    >
                        <Icon name="history" size={14} color={C.textSub} />{" "}
                        Atualizar
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setPage("nova")}
                    >
                        <Icon name="send" size={14} color="white" /> Nova
                        comunicação
                    </button>
                </div>
            </div>

            <div className="content">
                {error && (
                    <div
                        style={{
                            background: C.dangerBg,
                            color: C.danger,
                            borderRadius: 8,
                            padding: "10px 16px",
                            marginBottom: 16,
                            fontSize: 13,
                        }}
                    >
                        Erro ao carregar dados: {error}
                    </div>
                )}

                <div className="stat-row">
                    <StatCard
                        label="Enviados hoje"
                        value={stats.enviadosHoje}
                        sub="do backend"
                        icon="mail"
                    />
                    <StatCard
                        label="Agendados"
                        value={stats.agendados}
                        sub="próx. 24h"
                        icon="clock"
                    />
                    <StatCard
                        label="Burst máx. (min)"
                        value={stats.burstMax}
                        sub="limite 30"
                        icon="send"
                    />
                    <StatCard
                        label="Erros (24h)"
                        value={stats.erros}
                        sub="verificar logs"
                        icon="alert"
                    />
                </div>

                <div className="card">
                    <div className="activity-header">
                        <div>
                            <div className="activity-title">
                                Atividade recente
                            </div>
                            <div className="activity-sub">
                                {loading.comunicacoes
                                    ? "Carregando..."
                                    : "Últimas comunicações processadas."}
                            </div>
                        </div>
                        <span
                            className="activity-link"
                            onClick={() => setPage("historico")}
                        >
                            Ver tudo{" "}
                            <Icon
                                name="externalLink"
                                size={12}
                                color={C.green}
                            />
                        </span>
                    </div>

                    {loading.comunicacoes ? (
                        <div
                            style={{
                                textAlign: "center",
                                padding: 32,
                                color: C.textMuted,
                            }}
                        >
                            Carregando...
                        </div>
                    ) : recentes.length === 0 ? (
                        <div
                            style={{ textAlign: "center", padding: 32 }}
                            className="text-muted text-13"
                        >
                            Nenhuma comunicação.{" "}
                            <span
                                className="text-green"
                                style={{ cursor: "pointer" }}
                                onClick={() => setPage("nova")}
                            >
                                Criar agora →
                            </span>
                        </div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    {[
                                        "Destinatário",
                                        "Modelo",
                                        "Status",
                                        "Quando",
                                        "",
                                    ].map((h) => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recentes.map((a) => (
                                    <tr key={a.id}>
                                        <td className="td-primary">{a.dest}</td>
                                        <td className="td-sub">
                                            {a.modelo} · {a.versao}
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-6">
                                                <Badge status={a.status} />
                                                <select
                                                    value={a.status}
                                                    onChange={(e) => {
                                                        updateComunicacaoStatus(
                                                            a.id,
                                                            e.target.value,
                                                        );
                                                        show(
                                                            "Status atualizado.",
                                                        );
                                                    }}
                                                    className="status-inline-select"
                                                >
                                                    {[
                                                        "Enviado",
                                                        "Agendado",
                                                        "Erro",
                                                        "Rascunho",
                                                    ].map((s) => (
                                                        <option key={s}>
                                                            {s}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                        <td className="td-muted">{a.quando}</td>
                                        <td>
                                            <button
                                                className="btn-icon"
                                                onClick={() =>
                                                    setConfirmDelete(a.id)
                                                }
                                            >
                                                <Icon
                                                    name="trash"
                                                    size={15}
                                                    color={C.danger}
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {confirmDelete && (
                <Modal
                    title="Confirmar exclusão"
                    onClose={() => setConfirmDelete(null)}
                    width={360}
                >
                    <p className="text-sub mb-22">
                        Remover esta comunicação da lista local?
                    </p>
                    <div className="flex justify-end gap-10">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setConfirmDelete(null)}
                        >
                            Cancelar
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => {
                                removeComunicacao(confirmDelete);
                                setConfirmDelete(null);
                                show("Comunicação removida.");
                            }}
                        >
                            Remover
                        </button>
                    </div>
                </Modal>
            )}

            <Toast />
        </>
    );
}

export default Painel;
