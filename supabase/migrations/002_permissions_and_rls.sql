-- Permissions de base pour les rôles anon et authenticated
GRANT SELECT ON users TO anon;
GRANT ALL PRIVILEGES ON users TO authenticated;

-- Les instructeurs peuvent gérer leurs cours
GRANT ALL PRIVILEGES ON courses TO authenticated;
GRANT SELECT ON courses TO anon;

-- Accès aux leçons
GRANT SELECT ON lessons TO anon;
GRANT ALL PRIVILEGES ON lessons TO authenticated;

-- Accès aux inscriptions
GRANT ALL PRIVILEGES ON enrollments TO authenticated;
GRANT SELECT ON enrollments TO anon;

-- Accès aux transactions (lecture seule pour les utilisateurs)
GRANT SELECT ON transactions TO authenticated;

-- Gestion des tickets de support
GRANT ALL PRIVILEGES ON support_tickets TO authenticated;
GRANT SELECT ON support_tickets TO anon;

-- Accès au forum
GRANT SELECT ON forum_categories TO anon;
GRANT ALL PRIVILEGES ON forum_categories TO authenticated;
GRANT SELECT ON forum_posts TO anon;
GRANT ALL PRIVILEGES ON forum_posts TO authenticated;

-- RLS Policies pour les instructeurs-admin
-- Politiques pour la table users
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Instructors can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'instructor'
    )
  );

-- Politiques pour la table courses
CREATE POLICY "Anyone can view published courses" ON courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Instructors can manage their courses" ON courses
  FOR ALL USING (
    auth.uid() = instructor_id OR
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'instructor'
    )
  );

-- Politiques pour la table lessons
CREATE POLICY "Anyone can view lessons from published courses" ON lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = lessons.course_id AND c.is_published = true
    )
  );

CREATE POLICY "Instructors can manage lessons in their courses" ON lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = lessons.course_id AND c.instructor_id = auth.uid()
    )
  );

-- Politiques pour la table enrollments
CREATE POLICY "Users can view their own enrollments" ON enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view enrollments in their courses" ON enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = enrollments.course_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own enrollments" ON enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments" ON enrollments
  FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour la table transactions
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view transactions for their courses" ON transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = transactions.course_id AND c.instructor_id = auth.uid()
    )
  );

-- Politiques pour la table support_tickets
CREATE POLICY "Users can view their own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets" ON support_tickets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Instructors can manage tickets for their courses" ON support_tickets
  FOR ALL USING (
    assigned_to = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = support_tickets.course_id AND c.instructor_id = auth.uid()
    )
  );

-- Politiques pour la table forum_categories
CREATE POLICY "Anyone can view active categories" ON forum_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Instructors can manage categories" ON forum_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'instructor'
    )
  );

-- Politiques pour la table forum_posts
CREATE POLICY "Anyone can view posts from active categories" ON forum_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM forum_categories fc
      WHERE fc.id = forum_posts.category_id AND fc.is_active = true
    )
  );

CREATE POLICY "Users can create posts" ON forum_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON forum_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON forum_posts
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Instructors can moderate posts" ON forum_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'instructor'
    )
  );

-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;