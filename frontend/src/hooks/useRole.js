export const useRole = () => {
    const { user } = useAuth();
    
    const hasRole = (roles) => {
      if (!user || !user.rol) return false;
      if (typeof roles === 'string') {
        return user.rol.includes(roles);
      }
      return roles.some(role => user.rol.includes(role));
    };
  
    const isAdmin = () => hasRole('ADMIN');
    const isDirector = () => hasRole('DIRECTOR');
    const isLider = () => hasRole('LIDER');
    const isDocente = () => hasRole('DOCENTE');
    const isColaborador = () => hasRole('COLABORADOR');
  
    return {
      hasRole,
      isAdmin,
      isDirector,
      isLider,
      isDocente,
      isColaborador,
    };
  };