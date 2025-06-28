import React, { createContext, useState, useContext } from 'react';

// 1. יוצרים את אובייקט ה-Context
const AuthContext = createContext(null);

// 2. יוצרים את קומפוננטת ה"ספק" (Provider)
// קומפוננטה זו תעטוף את כל האפליקציה ותספק לה את ה-state של האימות
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  // פונקציה לביצוע login - היא תקבל טוקן ותשמור אותו ב-state
  const login = (newToken) => {
    setToken(newToken);
    // באפליקציה אמיתית, היינו שומרים אותו גם ב-localStorage
  };

  // פונקציה לביצוע logout
  const logout = () => {
    setToken(null);
     // באפליקציה אמיתית, היינו מוחקים אותו גם מה-localStorage
  };

  // הערך שיהיה זמין לכל הקומפוננטות הילדים
  const value = {
    token,
    login,
    logout,
    isAuthenticated: !!token // משתנה בוליאני נוח לבדיקה אם המשתמש מחובר
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. יוצרים "Hook" מותאם אישית לגישה נוחה ל-Context
// במקום לייבא את useContext ו-AuthContext בכל מקום, פשוט נשתמש ב-Hook הזה
export function useAuth() {
  return useContext(AuthContext);
}